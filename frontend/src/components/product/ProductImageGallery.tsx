'use client';

import React, { useState, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ZoomIn, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductImage {
  url: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedImageIndex];

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  }, []);

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    }
  };

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square bg-muted flex items-center justify-center">
        <div className="text-muted-foreground text-center">
          <div className="w-16 h-16 mx-auto mb-2 opacity-50">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <p>No image available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative overflow-hidden group">
        <div
          ref={imageRef}
          className="relative aspect-square cursor-zoom-in"
          onMouseMove={handleImageHover}
          onMouseLeave={() => setIsZoomed(false)}
          onClick={toggleZoom}
        >
          <Image
            src={currentImage.url}
            alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
            priority={selectedImageIndex === 0}
            quality={90}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Zoom and Fullscreen Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox();
              }}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateLightbox('prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateLightbox('next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Lightbox Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            >
              <Image
                src={currentImage.url}
                alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                quality={95}
              />
            </motion.div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {selectedImageIndex + 1} of {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProductImageGallery);
