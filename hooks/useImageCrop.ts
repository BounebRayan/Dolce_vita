import { useState } from 'react';

export interface CropConfig {
  aspectRatio: number;
  cropName: string;
  minWidth: number;
  minHeight: number;
}

export const CROP_CONFIGS = {
  banner: {
    aspectRatio: 16 / 9, // 16:9 aspect ratio for banners
    cropName: 'Bannière',
    minWidth: 3840, // 4K Ultra HD resolution for banners
    minHeight: 2160,
  },
  aboutUs: {
    aspectRatio: 4 / 3, // 4:3 aspect ratio for about us
    cropName: 'À propos',
    minWidth: 1920, // 2K resolution
    minHeight: 1440,
  },
  category: {
    aspectRatio: 3 / 4, // 3:4 aspect ratio for categories (portrait)
    cropName: 'Catégorie',
    minWidth: 1200, // High resolution for categories
    minHeight: 1600,
  },
} as const;

export const useImageCrop = () => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [currentCropConfig, setCurrentCropConfig] = useState<CropConfig | null>(null);
  const [onCropComplete, setOnCropComplete] = useState<((croppedBlob: Blob) => void) | null>(null);

  const openCropModal = (
    imageFile: File,
    cropConfig: CropConfig,
    onComplete: (croppedBlob: Blob) => void
  ) => {
    setCurrentImageFile(imageFile);
    setCurrentCropConfig(cropConfig);
    setOnCropComplete(() => onComplete);
    setIsCropModalOpen(true);
  };

  const closeCropModal = () => {
    setIsCropModalOpen(false);
    setCurrentImageFile(null);
    setCurrentCropConfig(null);
    setOnCropComplete(null);
  };

  const handleCrop = (croppedBlob: Blob) => {
    if (onCropComplete) {
      onCropComplete(croppedBlob);
    }
    closeCropModal();
  };

  return {
    isCropModalOpen,
    currentImageFile,
    currentCropConfig,
    openCropModal,
    closeCropModal,
    handleCrop,
  };
};
