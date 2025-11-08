import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const event = req.body;
  const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK_URL;

  if (!GOOGLE_CHAT_WEBHOOK) {
    return res.status(500).send('Google Chat webhook URL not configured');
  }

  // Chỉ gửi khi deploy thành công
  if (event.type !== 'deployment.created' && event.type !== 'deployment.succeeded') {
    return res.status(200).send('Ignored event type');
  }

  const deploy = event.payload?.deployment;
  if (!deploy) return res.status(400).send('Missing deployment payload');

  const message = {
    text: `✅ *${deploy.name}* deployed successfully!\n\n🔗 ${deploy.url}\n👤 ${deploy.meta?.githubCommitAuthorName || 'Unknown'}`,
  };

  try {
    await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    res.status(200).send('OK');
  } catch (error) {
    console.error('Failed to send notification to Google Chat:', error);
    res.status(500).send('Failed to send notification');
  }
}
