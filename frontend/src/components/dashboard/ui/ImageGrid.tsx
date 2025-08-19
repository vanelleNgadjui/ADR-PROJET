import React from "react";

interface ImageItem {
  src: string;
  alt: string;
  className?: string;
}

interface ImageGridProps {
  images: ImageItem[];
  columns?: 1 | 2 | 3;
  gap?: number;
  className?: string;
  imageClassName?: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 1,
  gap = 5,
  className = "",
  imageClassName = ""
}) => {
  // Grid classes based on columns
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2", 
    3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
  };

  // Gap classes
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClass} ${className}`}>
      {images.map((image, index) => (
        <div key={index} className={image.className || ""}>
          <img
            src={image.src}
            alt={image.alt}
            className={`border border-gray-200 rounded-xl dark:border-gray-800 w-full h-auto object-cover ${imageClassName}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

// Composant ResponsiveImage pour une seule image
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          className={`w-full border border-gray-200 rounded-xl dark:border-gray-800 ${className}`}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export { ImageGrid, ResponsiveImage };
