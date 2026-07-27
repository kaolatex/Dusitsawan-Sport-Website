'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?q=80&w=800&auto=format&fit=crop';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = 'object-cover w-full h-full',
  containerClassName = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const displaySrc = error ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden bg-surface ${containerClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 pointer-events-none">
          <ImageOff size={24} className="text-primary/20" />
        </div>
      )}
    </div>
  );
}
