import type { Meta, StoryObj } from '@storybook/react';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';

import { SidebarView } from './Sidebar';
import type { SidebarProps } from './Sidebar.types';
import { getSidebarItems } from './SidebarItems';

const activeHrefOptions = getSidebarItems().map((item) => item.href);

const SidebarPreview = ({ activeHref, defaultCollapsed }: SidebarProps): JSX.Element => {
  const [currentActiveHref, setCurrentActiveHref] = useState(activeHref ?? activeHrefOptions[0]);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed ?? false);

  useEffect(() => {
    setCurrentActiveHref(activeHref ?? activeHrefOptions[0]);
  }, [activeHref]);

  useEffect(() => {
    setIsCollapsed(defaultCollapsed ?? false);
  }, [defaultCollapsed]);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest('a');
    const href = link?.getAttribute('href');

    if (!href) {
      return;
    }

    event.preventDefault();

    if (activeHrefOptions.includes(href)) {
      setCurrentActiveHref(href);
    }
  };

  return (
    <div onClick={handleClick} style={{ minHeight: '100vh', width: 'fit-content' }}>
      <SidebarView
        activeHref={currentActiveHref}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((currentState) => !currentState)}
      />
    </div>
  );
};

const meta: Meta<typeof SidebarPreview> = {
  title: 'UI/Sidebar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => <SidebarPreview {...args} />,
  args: {
    activeHref: '/dashboard',
    defaultCollapsed: false,
  },
  argTypes: {
    activeHref: {
      control: 'select',
      options: activeHrefOptions,
    },
    defaultCollapsed: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SidebarPreview>;

export const Default: Story = {};

export const ContentActive: Story = {
  args: {
    activeHref: '/content',
  },
};

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
  },
};

export const SupportActive: Story = {
  args: {
    activeHref: '/support',
  },
};
