import { UrlType } from '../domain/entities/models/faqs';

/**
 * Generate HTML content based on URL and URL type
 */
export const generateUrlHtml = (url: string, urlType: UrlType): string => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return '';
  }

  switch (urlType) {
    case UrlType.IMAGE:
      return `<div class="url-content image-content">
  <img src="${trimmedUrl}" alt="FAQ Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
</div>`;

    case UrlType.VIDEO: {
      // Check if it's a YouTube URL and convert to embed
      const youtubeMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `<div class="url-content video-content">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    width="560" 
    height="315" 
    frameborder="0" 
    allowfullscreen
    style="max-width: 100%; border-radius: 8px;">
  </iframe>
</div>`;
      }

      // For other video URLs, use video tag
      return `<div class="url-content video-content">
  <video controls style="max-width: 100%; height: auto; border-radius: 8px;">
    <source src="${trimmedUrl}" type="video/mp4">
    <p>Your browser does not support the video tag. <a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer">Click here to view the video</a></p>
  </video>
</div>`;
    }

    default:
      // Fallback for unknown URL types - create a simple link
      return `<div class="url-content link-content">
  <a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">
    View Content
  </a>
</div>`;
  }
};
