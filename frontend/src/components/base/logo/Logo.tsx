// components/base/logo/Logo.tsx
import './Logo.scss';

import React from 'react';

import { Image } from '../image/Image';

export type LogoAssetType = 'symbol' | 'wordmark';
export interface LogoProps {
  assetType: LogoAssetType;
  size?: 'small' | 'medium' | 'large' | 'header';
  className?: string;
  alt?: string;
}

const DimensionMap = {
  symbol: { small: 32, medium: 48, large: 64, header: 40 },
  wordmark: { small: 100, medium: 150, large: 200, header: 250 },
};

const AssetUrlMap: Record<LogoAssetType, string> = {
  symbol: '/logo.svg',
  wordmark: '/wordmark-logo.svg',
};

export const Logo: React.FC<LogoProps> = ({
  assetType,
  size = 'medium',
  className = '',
  alt = 'ATLAS Brand Mark',
}) => {
  const isWordmark = assetType === 'wordmark';
  const width = DimensionMap[assetType][size];
  const height = isWordmark
    ? DimensionMap[assetType][size] * (50 / 250) // adjust aspect ratio for wordmark
    : DimensionMap[assetType][size];

  const src = AssetUrlMap[assetType];

  return (
    <Image
      src={src}
      alt={alt}
      style={{ width, height }}
      className={`logo logo--${assetType} ${className}`}
    />
  );
};
