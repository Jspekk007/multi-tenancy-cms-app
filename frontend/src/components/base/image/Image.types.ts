export type ImageSize = 'small' | 'medium' | 'large' | 'cover';

export interface ImageProps {
  src?: string;
  svgContent?: string;
  alt: string;
  className?: string;
  size?: ImageSize;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}
