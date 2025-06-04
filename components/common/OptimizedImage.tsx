import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  fill = false,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn(
      'overflow-hidden',
      fill ? 'relative w-full h-full' : '',
      className
    )}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0',
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        )}
        sizes={sizes}
        quality={quality}
        priority={priority}
        fill={fill}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
} 