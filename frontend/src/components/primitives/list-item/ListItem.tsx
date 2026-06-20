'use client';

import './ListItem.scss';

import { Icon } from '../icon/Icon';

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ComponentProps<typeof Icon>['icon'];
  label?: string;
  href?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  className = '',
  icon,
  label,
  href,
  ...props
}) => {
  return href ? (
    <ListItemWithLink className={className} icon={icon} label={label} href={href} {...props} />
  ) : (
    <ListItemWithoutLink className={className} icon={icon} label={label} {...props} />
  );
};

export const ListItemWithoutLink: React.FC<ListItemProps> = ({
  className = '',
  icon,
  label,
  ...props
}) => {
  return (
    <li className={`list-item ${className}`} {...props}>
      {icon && <Icon icon={icon} variant="default" className="list-item-icon" />}
      {label && <span className="list-item-label">{label}</span>}
    </li>
  );
};

export const ListItemWithLink: React.FC<ListItemProps> = ({
  className = '',
  icon,
  label,
  href,
  ...props
}) => {
  return (
    <a href={href || '#'}>
      <li className={`list-item ${className}`} {...props}>
        {icon && <Icon icon={icon} variant="default" className="list-item-icon" />}
        {label && <span className="list-item-label">{label}</span>}
      </li>
    </a>
  );
};
