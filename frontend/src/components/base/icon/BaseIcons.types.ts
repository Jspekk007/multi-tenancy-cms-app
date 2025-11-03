export type IconName =
  | 'add'
  | 'alert'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'check'
  | 'close'
  | 'delete'
  | 'edit'
  | 'search'
  | 'settings'
  | 'user';

export interface BaseIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
}
