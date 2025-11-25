import './Logo.scss';

import React from 'react';

import SvgLogo from '@/assets/svg/logo.svg?raw';
import SvgWordMark from '@/assets/svg/wordmark-logo.svg?raw';

import { Image } from '../image/Image';
import { LogoAssetType, LogoProps } from './Logo.types';

const AssetContentMap: Record<LogoAssetType, string> = {
  symbol: SvgLogo,
  wordmark: SvgWordMark,
};

const DimensionMap = {
  symbol: { small: 32, medium: 48, large: 64, header: 40 },
  wordmark: { small: 100, medium: 150, large: 200, header: 250 },
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
    ? DimensionMap[assetType][size] * (50 / 250)
    : DimensionMap[assetType][size];

  const svgContent = AssetContentMap[assetType];

  return (
    <Image
      svgContent={svgContent}
      alt={alt}
      className={`logo logo--${assetType} logo--${size} ${className}`}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};
