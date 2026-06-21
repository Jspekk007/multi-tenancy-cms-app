'use client';

import { useState } from 'react';

import { Avatar } from '@/components/primitives/avatar/Avatar';
import { Button } from '@/components/primitives/button/Button';
import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

import { avatarMenuOptions } from '../AppHeader.constants';
import { getAvatarInitials } from '../utils/AppHeader.utils';
import { AppHeaderNotifications } from './AppHeaderNotifications';
import { AppHeaderQuickHelp } from './AppHeaderQuickHelp';

interface AppHeaderActionsProps {
  userEmail?: string;
  onAvatarMenuSelect: (option: DropdownOption) => void;
}

type AppHeaderPanel = 'notifications' | 'help';

export const AppHeaderActions: React.FC<AppHeaderActionsProps> = ({
  userEmail,
  onAvatarMenuSelect,
}) => {
  const [openPanel, setOpenPanel] = useState<AppHeaderPanel | null>(null);

  const handlePanelOpenChange = (panel: AppHeaderPanel, isOpen: boolean): void => {
    setOpenPanel(isOpen ? panel : null);
  };

  return (
    <div className="app-header__actions">
      <div className="app-header__deploy">
        <Button variant="primary" size="small" icon="rocket" iconVariant="white" ariaLabel="Deploy">
          Deploy
        </Button>
      </div>
      <AppHeaderNotifications
        isOpen={openPanel === 'notifications'}
        onOpenChange={(isOpen) => handlePanelOpenChange('notifications', isOpen)}
      />
      <AppHeaderQuickHelp
        isOpen={openPanel === 'help'}
        onOpenChange={(isOpen) => handlePanelOpenChange('help', isOpen)}
      />
      <Avatar
        className="app-header__avatar"
        initials={getAvatarInitials(userEmail)}
        alt="Open profile menu"
        menuEnabled
        menuOptions={avatarMenuOptions}
        onMenuSelect={onAvatarMenuSelect}
      />
    </div>
  );
};
