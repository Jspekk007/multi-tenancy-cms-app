import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System',
};

export default meta;

// Define tokens matching your SCSS
const fontSizes = [
  'font-size-xs',
  'font-size-sm',
  'font-size-md',
  'font-size-lg',
  'font-size-xl',
  'font-size-2xl',
  'font-size-3xl',
];

const fontWeights = [
  'font-weight-normal',
  'font-weight-medium',
  'font-weight-semibold',
  'font-weight-bold',
];

const lineHeights = ['line-height-sm', 'line-height-md', 'line-height-lg'];

export const AllTypography: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Font Sizes */}
      <section>
        <h2>Font Sizes</h2>
        {fontSizes.map((size) => (
          <div key={size} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: `var(--${size})` }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{size}</div>
            <div style={{ fontSize: '0.65rem', color: '#888' }}>{`var(--${size})`}</div>
          </div>
        ))}
      </section>

      {/* Font Weights */}
      <section>
        <h2>Font Weights</h2>
        {fontWeights.map((weight) => (
          <div key={weight} style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: `var(--${weight})`, fontSize: '1rem' }}>
              Font weight example
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{weight}</div>
            <div style={{ fontSize: '0.65rem', color: '#888' }}>{`var(--${weight})`}</div>
          </div>
        ))}
      </section>

      {/* Line Heights */}
      <section>
        <h2>Line Heights</h2>
        {lineHeights.map((lh) => (
          <div key={lh} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                lineHeight: `var(--${lh})`,
                fontSize: '1rem',
                border: '1px dashed #ccc',
                padding: '0.5rem',
              }}
            >
              Line height example text
              <br />
              Another line to show spacing
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{lh}</div>
            <div style={{ fontSize: '0.65rem', color: '#888' }}>{`var(--${lh})`}</div>
          </div>
        ))}
      </section>
    </div>
  ),
};
