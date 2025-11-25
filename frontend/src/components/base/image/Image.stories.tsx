// src/components/Image/Image.stories.tsx

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Image } from './Image';
import { ImageProps } from './Image.types';

// Raw SVG for demonstration purposes (Use your actual logo-symbol.svg content here)
const MockLogoSvgContent = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mockGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6"/> 
      <stop offset="100%" stop-color="#8b5cf6"/> 
    </linearGradient>
  </defs>
  <path fill="url(#mockGrad)" d="M 0 0 L 100 0 L 100 100 L 0 100 Z"/>
  <text x="50" y="55" font-size="20" fill="white" text-anchor="middle">SVG Content</text>
</svg>`;

export default {
  title: 'UI/BaseImage',
  component: Image,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'cover'] },
    loading: { control: 'select', options: ['lazy', 'eager'] },
    src: { control: 'text' },
    svgContent: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<ImageProps> = (args) => <Image {...args} />;

export const StandardImage = Template.bind({});
StandardImage.args = {
  src: 'https://via.placeholder.com/150/93c5fd/ffffff?text=JPG', // Placeholder URL
  alt: 'Example standard image',
  size: 'large',
  loading: 'lazy',
};

export const SvgComponent = Template.bind({});
SvgComponent.args = {
  svgContent: MockLogoSvgContent,
  alt: 'SVG Logo rendered as content',
  size: 'medium',
  style: {
    border: '2px solid black',
    borderRadius: '4px',
  },
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  src: undefined,
  svgContent: undefined,
  alt: 'Missing image placeholder',
  size: 'large',
};
