'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/primitives/button/Button';
import { Icon } from '@/components/primitives/icon/Icon';
import { useClickOutside } from '@/hooks/useClickOutside';

interface AppHeaderNotificationsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AppHeaderNotifications: React.FC<AppHeaderNotificationsProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationRef, () => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className="app-header__notifications" ref={notificationRef}>
      <Button
        variant="ghost"
        size="small"
        icon="bell"
        iconVariant="secondary"
        iconOnly
        ariaLabel="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => onOpenChange(!isOpen)}
      />

      {isOpen && (
        <div
          className="app-header__notifications-popover"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="app-header__notifications-header">Notifications</div>
          <div className="app-header__notifications-empty">
            <Icon icon="bell" aria-hidden="true" />
            <span>No notifications</span>
          </div>
        </div>
      )}
    </div>
  );
};
