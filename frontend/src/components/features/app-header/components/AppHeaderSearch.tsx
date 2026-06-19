'use client';

import { useEffect, useRef } from 'react';

import { Input } from '@/components/primitives/form/shared/input/Input';
import { Icon } from '@/components/primitives/icon/Icon';

const isEditableTarget = (target: EventTarget | null): boolean => {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
};

export const AppHeaderSearch: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === '/' && !isEditableTarget(event.target)) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="app-header__search">
      <Input
        ref={searchInputRef}
        type="search"
        size="small"
        placeholder="Search entries..."
        aria-label="Search entries"
        prefix={<Icon icon="search" className="app-header__search-icon" aria-hidden="true" />}
      />
    </div>
  );
};
