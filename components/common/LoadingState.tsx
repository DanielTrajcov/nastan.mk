import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  variant?: 'card' | 'button' | 'text' | 'image';
  className?: string;
  count?: number;
  aspectRatio?: 'square' | 'video';
}

export function LoadingState({
  variant = 'text',
  className,
  count = 1,
  aspectRatio = 'square'
}: LoadingStateProps) {
  const getLoadingElement = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <div className={cn(
              "w-full bg-gray-200 rounded-lg animate-pulse",
              aspectRatio === 'square' ? "aspect-square" : "aspect-video"
            )} />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="flex items-center justify-center w-full">
            <div className="h-5 w-5 border-2 border-t-transparent border-accent rounded-full animate-spin" />
          </div>
        );
      case 'image':
        return (
          <div className={cn(
            "w-full bg-gray-200 animate-pulse rounded-lg",
            aspectRatio === 'square' ? "aspect-square" : "aspect-video"
          )} />
        );
      case 'text':
      default:
        return (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        );
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{getLoadingElement()}</div>
      ))}
    </div>
  );
} 