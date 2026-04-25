import './Avatar.scss';

import { Dropdown } from '../dropdown/Dropdown';
import { BaseIcon } from '../icon/BaseIcon';
import { AvatarProps } from './Avatar.types';

const defaultMenuOptions = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  initials,
  className = '',
  menuEnabled = true,
  menuOptions = defaultMenuOptions,
}) => {
  const avatarContent = (
    <div className="avatar-wrapper">
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : initials ? (
        <div className="avatar-initials">{initials}</div>
      ) : (
        <div className="avatar-placeholder" aria-label={alt}>
          <BaseIcon icon="user" />
        </div>
      )}
    </div>
  );

  if (menuEnabled) {
    return (
      <div className={`avatar ${className}`}>
        <Dropdown
          options={menuOptions}
          triggerContent={avatarContent}
          triggerClassName="avatar-trigger"
          triggerAriaLabel={alt}
          hideChevron
        />
      </div>
    );
  }

  return <div className={`avatar ${className}`}>{avatarContent}</div>;
};
