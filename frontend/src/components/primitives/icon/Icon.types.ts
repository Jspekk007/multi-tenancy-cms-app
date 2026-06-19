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
  | 'dashboard'
  | 'content'
  | 'search'
  | 'settings'
  | 'user'
  | 'eye'
  | 'eye-off'
  | 'media'
  | 'users';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
}
