import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

import { AppHeaderView } from './AppHeader';
import { defaultSiteOption, siteOptions } from './AppHeader.constants';

interface AppHeaderStoryArgs {
  userEmail: string;
}

const AppHeaderPreview = ({ userEmail }: AppHeaderStoryArgs): JSX.Element => {
  const [selectedSite, setSelectedSite] = useState<DropdownOption>(defaultSiteOption);

  return (
    <AppHeaderView
      userEmail={userEmail}
      siteOptions={siteOptions}
      selectedSite={selectedSite}
      onSiteSelect={setSelectedSite}
      onAvatarMenuSelect={() => undefined}
    />
  );
};

const meta: Meta<AppHeaderStoryArgs> = {
  title: 'UI/AppHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => <AppHeaderPreview {...args} />,
  args: {
    userEmail: 'admin@atlas.cms',
  },
  argTypes: {
    userEmail: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<AppHeaderStoryArgs>;

export const Default: Story = {};
