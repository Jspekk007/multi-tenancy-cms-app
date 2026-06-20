export type LogoAssetType = 'symbol' | 'wordmark';

export type LogoSize = 'small' | 'medium' | 'large' | 'header';

export interface LogoProps {
  assetType: LogoAssetType;
  size?: LogoSize;
  className?: string;
  alt?: string;
}
