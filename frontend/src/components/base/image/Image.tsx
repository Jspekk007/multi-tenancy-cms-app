import './Image.scss';

import clsx from 'clsx';
import React from 'react';

import { ImageProps } from './Image.types';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  loading = 'lazy',
  style,
}) => {
  return (
    <div
      className={clsx('image', `image--${size}`, className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {src ? (
        <img className="image__source" src={src} alt={alt} loading={loading} />
      ) : (
        <div className="image__placeholder" aria-hidden />
      )}
    </div>
  );
};
