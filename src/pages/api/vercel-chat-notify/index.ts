import { NextApiRequest, NextApiResponse } from 'next';

// Map<deploymentId, timestamp> để track và tự động cleanup
const processedDeployments = new Map<string, number>();
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

function cleanupOldEntries() {
  const now = Date.now();
  for (const [id, timestamp] of processedDeployments.entries()) {
    if (now - timestamp > CACHE_TTL) {
      processedDeployments.delete(id);
    }
  }

  // Nếu vẫn còn quá nhiều entries, xóa các entries cũ nhất
  if (processedDeployments.size > MAX_CACHE_SIZE) {
    const entries = Array.from(processedDeployments.entries()).sort((a, b) => a[1] - b[1]); // Sort by timestamp
    const toDelete = entries.slice(0, processedDeployments.size - MAX_CACHE_SIZE);
    toDelete.forEach(([id]) => processedDeployments.delete(id));
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  // Cleanup entries cũ mỗi lần có request (lazy cleanup)
  cleanupOldEntries();

  const event = req.body;
  const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK;

  if (!GOOGLE_CHAT_WEBHOOK) {
    return res.status(500).send('Google Chat webhook URL not configured');
  }

  const eventType = event.type || event.event;
  if (
    eventType &&
    !eventType.includes('deployment.ready') &&
    !eventType.includes('deployment.succeeded')
  ) {
    console.log(`Skipping event type: ${eventType}`);
    return res.status(200).json({ message: 'Event type ignored' });
  }

  const deploy = event.payload?.deployment;
  if (!deploy) {
    console.log('Missing deployment payload');
    return res.status(400).send('Missing deployment payload');
  }

  const deploymentId = deploy.id || deploy.uid;
  if (deploymentId) {
    const existingTimestamp = processedDeployments.get(deploymentId);
    if (existingTimestamp && Date.now() - existingTimestamp < CACHE_TTL) {
      console.log(`Deployment ${deploymentId} already processed, skipping`);
      return res.status(200).json({ message: 'Already processed' });
    }
  }

  // Đánh dấu deployment này đã được xử lý (trước khi gửi để tránh race condition)
  if (deploymentId) {
    processedDeployments.set(deploymentId, Date.now());
  }

  const message = {
    text: `✅ *${deploy.name}* deployed successfully!\n\n🔗 ${deploy.url}\n👤 ${deploy.meta?.githubCommitAuthorName || 'Unknown'}`,
  };

  try {
    const chatResponse = await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(message),
    });

    if (!chatResponse.ok) {
      console.error('Google Chat API error:', await chatResponse.text());
      // Nếu lỗi, remove deploymentId khỏi cache để có thể retry
      if (deploymentId) {
        processedDeployments.delete(deploymentId);
      }
      return res.status(500).send('Failed to send notification');
    }

    return res.status(200).json({ success: true, deploymentId });
  } catch (error) {
    console.error('Failed to send notification to Google Chat:', error);
    // Nếu lỗi, remove deploymentId khỏi cache để có thể retry
    if (deploymentId) {
      processedDeployments.delete(deploymentId);
    }
    return res.status(500).send('Failed to send notification');
  }
}
