import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedImageBlob: Blob) => void;
  imageFile: File | null;
  aspectRatio: number;
  cropName: string;
  minWidth?: number;
  minHeight?: number;
  cropConfig?: {
    minWidth: number;
    minHeight: number;
  };
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  onCrop,
  imageFile,
  aspectRatio,
  cropName,
  minWidth = 200,
  minHeight = 200,
  cropConfig,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Calculate crop size based on image dimensions and aspect ratio
    let cropWidth = 90; // percentage
    let cropHeight = 90; // percentage
    
    // Adjust crop size based on aspect ratio
    if (aspectRatio > 1) {
      // Landscape - limit height
      cropHeight = Math.min(90, (90 * aspectRatio) / (width / height));
    } else {
      // Portrait - limit width
      cropWidth = Math.min(90, (90 / aspectRatio) * (width / height));
    }
    
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: cropWidth,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, [aspectRatio]);

  // Convert canvas to blob with high resolution
  const getCroppedImg = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!completedCrop || !imgRef.current || !canvasRef.current) {
        reject(new Error('Missing required elements'));
        return;
      }

      const image = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Calculate the actual crop dimensions in natural image coordinates
      const sourceX = completedCrop.x * scaleX;
      const sourceY = completedCrop.y * scaleY;
      const sourceWidth = completedCrop.width * scaleX;
      const sourceHeight = completedCrop.height * scaleY;

      // For high resolution, we'll use the natural image dimensions
      // but ensure minimum quality based on the crop config
      const configMinWidth = cropConfig?.minWidth || minWidth;
      const configMinHeight = cropConfig?.minHeight || minHeight;
      
      // Calculate scale factor to ensure minimum dimensions
      const scaleFactor = Math.max(
        configMinWidth / completedCrop.width,
        configMinHeight / completedCrop.height,
        1 // Don't scale down
      );

      // Set canvas size to high resolution dimensions
      canvas.width = completedCrop.width * scaleFactor;
      canvas.height = completedCrop.height * scaleFactor;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set image smoothing for high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the cropped portion at high resolution
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );


      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95); // Higher quality JPEG
    });
  }, [completedCrop, cropConfig, minWidth, minHeight]);

  // Update preview canvas when crop changes
  const updatePreview = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate preview dimensions (max 300px for preview)
    const maxPreviewSize = 300;
    const previewScale = Math.min(
      maxPreviewSize / completedCrop.width,
      maxPreviewSize / completedCrop.height,
      1
    );

    const previewWidth = completedCrop.width * previewScale;
    const previewHeight = completedCrop.height * previewScale;

    // Set canvas size for preview
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set image smoothing for high quality preview
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the cropped portion for preview
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      previewWidth,
      previewHeight
    );

  }, [completedCrop]);

  // Update preview when crop changes
  React.useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Handle crop completion
  const handleCrop = async () => {
    if (!completedCrop) return;

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg();
      onCrop(croppedImageBlob);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Erreur lors du recadrage de l\'image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load image when file changes
  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCrop(undefined);
      setCompletedCrop(undefined);
      setImgSrc('');
    }
  }, [isOpen]);

  if (!isOpen || !imgSrc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recadrer l'image - {cropName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ajustez le recadrage selon les dimensions recommandées. Ratio d'aspect: {aspectRatio}:1
          </p>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Crop Area */}
            <div className="flex-1">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  minWidth={minWidth}
                  minHeight={minHeight}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Preview and Controls */}
            <div className="lg:w-80 space-y-4">
              {/* Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ minHeight: '200px' }}>
                  {completedCrop ? (
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-48 object-contain"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Ajustez le recadrage pour voir l'aperçu
                    </div>
                  )}
                </div>
                {completedCrop && (
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>
                      Aperçu: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
                    </p>
                    <p className="font-medium text-gray-700">
                      Résolution finale: {Math.round(completedCrop.width * Math.max(
                        (cropConfig?.minWidth || minWidth) / completedCrop.width,
                        (cropConfig?.minHeight || minHeight) / completedCrop.height,
                        1
                      ))} × {Math.round(completedCrop.height * Math.max(
                        (cropConfig?.minWidth || minWidth) / completedCrop.width,
                        (cropConfig?.minHeight || minHeight) / completedCrop.height,
                        1
                      ))}px
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Faites glisser pour repositionner</li>
                  <li>• Utilisez les coins pour redimensionner</li>
                  <li>• Le ratio d'aspect sera maintenu</li>
                  <li>• Résolution minimale: {minWidth}×{minHeight}px</li>
                  <li>• L'image sera automatiquement mise à l'échelle haute résolution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCrop}
              disabled={!completedCrop || isProcessing}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Traitement...
                </>
              ) : (
                'Recadrer et sauvegarder'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
