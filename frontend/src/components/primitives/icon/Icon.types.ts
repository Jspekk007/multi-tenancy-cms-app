import type { IconName } from './Icons';

export type { IconName } from './Icons';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
}
