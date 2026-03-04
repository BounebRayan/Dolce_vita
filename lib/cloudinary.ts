/**
 * Adds Cloudinary `f_auto` (automatic format based on browser support)
 * and `q_auto` (automatic quality) transformations to a Cloudinary URL.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/f_auto') || url.includes('/q_auto')) return url;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

/**
 * Converts an image File to WebP format on the client side using canvas.
 * Returns a new File with the same name but .webp extension.
 */
export function convertToWebP(file: File, quality = 0.9): Promise<File> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/webp') {
      resolve(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas conversion failed'));
            return;
          }
          const webpName = file.name.replace(/\.[^.]+$/, '.webp');
          resolve(new File([blob], webpName, { type: 'image/webp' }));
        },
        'image/webp',
        quality,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
