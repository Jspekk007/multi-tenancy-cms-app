// src/components/Image/Image.stories.tsx

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Image } from './Image';
import { ImageProps } from './Image.types';

const MockLogoSvgContent = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mockGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#mockGrad)" />
  <text
    x="50"
    y="58"
    font-size="18"
    fill="white"
    text-anchor="middle"
    font-family="Arial, sans-serif"
  >
    SVG
  </text>
</svg>
`;

export default {
  title: 'UI/Base/Image',
  component: Image,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'cover'],
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
    },
    src: { control: 'text' },
    svgContent: { control: 'text' },
  },
} as Meta<typeof Image>;

const Template: StoryFn<ImageProps> = (args) => <Image {...args} />;

export const StandardImage = Template.bind({});
StandardImage.args = {
  src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  alt: 'Product image',
  size: 'large',
};

export const SvgContent = Template.bind({});
SvgContent.args = {
  svgContent: MockLogoSvgContent,
  alt: 'SVG rendered via inner content',
  size: 'medium',
  style: {
    border: '2px solid black',
    borderRadius: 4,
  },
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  alt: 'Missing image placeholder',
  size: 'large',
};
