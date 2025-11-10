import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import { DropdownOption } from './Dropdown.types';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/BaseDropdown',
  component: Dropdown,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

// Example options
const options: DropdownOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<DropdownOption | null>(null);
    return (
      <div style={{ width: 240, padding: 40 }}>
        <Dropdown
          options={options}
          selected={selected}
          onSelect={setSelected}
          placeholder="Select an option"
        />
      </div>
    );
  },
};

export const Preselected: Story = {
  render: () => {
    const [selected, setSelected] = useState<DropdownOption>({ label: 'Option B', value: 'b' });
    return (
      <div style={{ width: 240, padding: 40 }}>
        <Dropdown options={options} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 240, padding: 40 }}>
      <Dropdown options={options} selected={null} disabled placeholder="Disabled dropdown" />
    </div>
  ),
};
