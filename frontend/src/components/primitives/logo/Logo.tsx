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
  const height = isWordmark
    ? DimensionMap[assetType][size] * (40 / 120)
    : DimensionMap[assetType][size];

  const src = AssetUrlMap[assetType];
  const wrapperStyle = { height, width: 'auto' };
  const imageStyle = {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <div className={`logo logo--${assetType} ${className}`} style={wrapperStyle}>
      <Image src={src} alt={alt} className="logo__image" style={imageStyle} />
    </div>
  );
};
