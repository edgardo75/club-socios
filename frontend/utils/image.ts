export const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  try {
    // Handle Google Drive links
    // Supports:
    // - drive.google.com/file/d/ID/view
    // - drive.google.com/open?id=ID
    // - docs.google.com/file/d/ID
    
    const drivePatterns = [
      /file\/d\/([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/
    ];

    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      for (const pattern of drivePatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          // Use thumbnail endpoint which is more reliable for embedding
          // sz=w1000 requests a large version (width 1000px)
          return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
      }
    }

    // Handle Dropbox links
    // Format: https://www.dropbox.com/.../file.jpg?dl=0
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'raw=1');
    }

    return url;
  } catch (e) {
    return url;
  }
};
