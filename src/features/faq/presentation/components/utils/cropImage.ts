// /utils/cropImage.ts

interface PixelCrop {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const getCroppedImg = (imageSrc: string, pixelCrop: PixelCrop): Promise<string> => {
  const canvas = document.createElement('canvas');
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.onerror = () => {
      reject(new Error('Image failed to load'));
    };
  });
};
