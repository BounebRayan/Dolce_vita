"use client";

import { useState, useEffect, useRef } from 'react';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ProductImageCarousel({ images, alt, className = '' }: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, images.length]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.length > 0 ? (
        images.map((img, idx) => (
          <img
            key={idx}
            src={optimizeCloudinaryUrl(img) || "https://placehold.co/600x400/F5F5F1/F5F5F1"}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))
      ) : (
        <img
          src="https://placehold.co/600x400/F5F5F1/F5F5F1"
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
      {images.length > 1 && isHovered && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
