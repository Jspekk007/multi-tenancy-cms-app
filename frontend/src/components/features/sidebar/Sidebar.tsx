'use client';

import './Sidebar.scss';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { SidebarCreateAction } from './components/SidebarCreateAction';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarNav } from './components/SidebarNav';
import type { SidebarProps, SidebarViewProps } from './Sidebar.types';
import { getSidebarItems, sidebarItems } from './SidebarItems';
import { getActiveSidebarHref, mobileSidebarQuery } from './utils/Sidebar.utils';

export const Sidebar: React.FC<SidebarProps> = ({ activeHref, defaultCollapsed }) => {
  const pathname = usePathname();
  const hasUserToggled = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed ?? false);

  useEffect(() => {
    if (defaultCollapsed !== undefined) {
      setIsCollapsed(defaultCollapsed);
    }
  }, [defaultCollapsed]);

  useEffect(() => {
    if (defaultCollapsed !== undefined || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(mobileSidebarQuery);
    const syncCollapsedState = (matches: boolean): void => {
      if (!hasUserToggled.current) {
        setIsCollapsed(matches);
      }
    };
    const handleMediaQueryChange = (event: MediaQueryListEvent): void => {
      syncCollapsedState(event.matches);
    };

    syncCollapsedState(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return (): void => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [defaultCollapsed]);

  const handleToggle = (): void => {
    hasUserToggled.current = true;
    setIsCollapsed((currentCollapsedState) => !currentCollapsedState);
  };

  const resolvedActiveHref = activeHref ?? getActiveSidebarHref(pathname, getSidebarItems());

  return (
    <SidebarView
      activeHref={resolvedActiveHref}
      isCollapsed={isCollapsed}
      onToggle={handleToggle}
    />
  );
};

export const SidebarView: React.FC<SidebarViewProps> = ({ activeHref, isCollapsed, onToggle }) => {
  return (
    <aside className={clsx('sidebar', { 'is-collapsed': isCollapsed })} aria-label="Sidebar">
      <div className="sidebar-top">
        <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle} />
        <SidebarNav
          ariaLabel="Primary navigation"
          activeHref={activeHref}
          isCollapsed={isCollapsed}
          items={sidebarItems.header}
        />
        <SidebarCreateAction isCollapsed={isCollapsed} />
      </div>

      <div className="sidebar-bottom">
        <hr className="sidebar-divider" />

        <SidebarNav activeHref={activeHref} isCollapsed={isCollapsed} items={sidebarItems.footer} />
      </div>
    </aside>
  );
};
