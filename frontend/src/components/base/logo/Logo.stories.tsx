import { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';
import { LogoProps } from './Logo.types';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
    assetType: {
      control: { type: 'select' },
      options: ['symbol', 'wordmark'],
      description: 'Defines which asset to render: Icon (symbol) or Text+Icon (wordmark).',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'header'],
      description: 'Predefined size variant for the asset.',
    },
  },
  args: {
    assetType: 'symbol',
    alt: 'ATLAS Brand Mark',
    className: '',
  },
};

export default meta;

type Story = StoryObj<LogoProps>;

export const SymbolSmall: Story = {
  name: 'Symbol (Icon) - Small',
  args: {
    assetType: 'symbol',
    size: 'small',
  },
};

export const SymbolMedium: Story = {
  name: 'Symbol (Icon) - Medium',
  args: {
    assetType: 'symbol',
    size: 'medium',
  },
};

export const SymbolLarge: Story = {
  name: 'Symbol (Icon) - Large',
  args: {
    assetType: 'symbol',
    size: 'large',
  },
};

export const WordmarkSmall: Story = {
  name: 'Wordmark - Small',
  args: {
    assetType: 'wordmark',
    size: 'small',
    alt: 'ATLAS Wordmark Small',
  },
};

export const WordmarkMedium: Story = {
  name: 'Wordmark - Medium',
  args: {
    assetType: 'wordmark',
    size: 'medium',
    alt: 'ATLAS Wordmark Medium',
  },
};

export const WordmarkLarge: Story = {
  name: 'Wordmark - Large',
  args: {
    assetType: 'wordmark',
    size: 'large',
    alt: 'ATLAS Wordmark Large',
  },
};

export const WordmarkHeader: Story = {
  name: 'Wordmark - Header Bar',
  args: {
    assetType: 'wordmark',
    size: 'header',
    alt: 'ATLAS CMS Header Logo',
  },
};
