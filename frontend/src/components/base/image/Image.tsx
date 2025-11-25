import './Image.scss';

import { ImageProps, ImageSize } from './Image.types';

const sizeMap: Record<ImageSize, string> = {
  small: 'image--small',
  medium: 'image--medium',
  large: 'image--large',
  cover: 'image--cover',
};

export const Image: React.FC<ImageProps> = ({
  src,
  svgContent,
  alt,
  className = '',
  size = 'medium',
  loading = 'lazy',
  width,
  height,
  style,
}) => {
  const rootClass = `image ${sizeMap[size]} ${className}`;

  if (svgContent) {
    return (
      <div
        className={rootClass}
        style={style}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        role="img"
        aria-label={alt}
      />
    );
  }

  if (src) {
    return (
      <div className={rootClass} style={style}>
        <img
          src={src}
          alt={alt}
          className="image__source"
          loading={loading}
          width={width}
          height={height}
        />
      </div>
    );
  }

  return (
    <div className={`${rootClass} image--placeholder`} aria-label="Image Placeholder">
      <span className="image__placeholder-text">No Image</span>
    </div>
  );
};
