'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/primitives/button/Button';
import { useClickOutside } from '@/hooks/useClickOutside';

interface AppHeaderQuickHelpProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AppHeaderQuickHelp: React.FC<AppHeaderQuickHelpProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const helpRef = useRef<HTMLDivElement>(null);

  useClickOutside(helpRef, () => {
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
    <div className="app-header__help" ref={helpRef}>
      <Button
        variant="ghost"
        size="small"
        icon="help-circle"
        iconVariant="secondary"
        iconOnly
        ariaLabel="Quick help"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => onOpenChange(!isOpen)}
      />

      {isOpen && (
        <div className="app-header__help-popover" role="dialog" aria-label="Quick help">
          <div className="app-header__help-header">Quick help</div>
          <div className="app-header__shortcut-list">
            <div className="app-header__shortcut-item">
              <kbd>/</kbd>
              <span>Focus search</span>
            </div>
            <div className="app-header__shortcut-item">
              <kbd>Esc</kbd>
              <span>Close panel</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
