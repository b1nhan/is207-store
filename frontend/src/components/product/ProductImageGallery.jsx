'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ProductImageGallery({ images, thumbnail }) {
  const allImages = [
    ...(thumbnail ? [{ url: thumbnail, alt: 'Thumbnail' }] : []),
    ...(images || [])
  ];

  const [mainImage, setMainImage] = useState(allImages[0]?.url || '/placeholder.png');

  if (allImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">Không có hình ảnh nào</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {allImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                <img
                  src={img.url}
                  alt={`Hình ảnh sản phẩm ${idx}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {allImages.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
}
