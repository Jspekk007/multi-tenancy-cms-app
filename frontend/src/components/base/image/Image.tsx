import './Image.scss';

import React from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  style,
  loading = 'lazy',
}) => {
  return (
    <div
      className={`image ${className}`}
      style={{
        width,
        height,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};
