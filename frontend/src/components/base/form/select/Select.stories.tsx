import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';
import { SelectOption } from './Select.types';

const meta: Meta<typeof Select> = {
  title: 'UI/Form/Select',
  component: Select,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Select>;

const options: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ width: 240, padding: 40 }}>
        <Select
          label="default"
          name="default"
          options={options}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

export const Preselected: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>('orange');
    return (
      <div style={{ width: 240, padding: 40 }}>
        <Select
          label="preselected"
          name="preselected"
          options={options}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 240, padding: 40 }}>
      <Select label="disabled" name="disabled" options={options} value={null} disabled />
    </div>
  ),
};
