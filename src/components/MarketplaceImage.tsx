import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface MarketplaceImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: boolean;
}

/**
 * Standardized image component for all marketplaces
 * Handles loading, errors, and provides fallback display
 */
export const MarketplaceImage: React.FC<MarketplaceImageProps> = ({
  src,
  alt,
  className = "w-full h-40 object-cover",
  fallbackIcon = true
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no image provided or error occurred, show placeholder
  if (!src || hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}>
        {fallbackIcon && (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading skeleton */}
      {isLoading && (
        <div className={`${className} bg-gray-200 animate-pulse absolute inset-0`} />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error(`Failed to load image: ${src}`);
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
      />
    </div>
  );
};
