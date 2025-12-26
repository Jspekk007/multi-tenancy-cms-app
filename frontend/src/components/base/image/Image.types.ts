export type ImageSize = 'small' | 'medium' | 'large' | 'cover';

export interface ImageProps {
  src?: string;
  svgContent?: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  small: { width: 40, height: 40 },
  medium: { width: 80, height: 80 },
  large: { width: 160, height: 160 },
  cover: { width: 240, height: 160 },
};
