import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Form/Switch',
  component: Switch,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch label="Story" checked={checked} onChange={setChecked} />;
  },
};

export const checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Switch label="Story" checked={checked} onChange={setChecked} />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch label="Story" checked={checked} onChange={setChecked} disabled />;
  },
};
