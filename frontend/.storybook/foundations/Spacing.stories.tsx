import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System',
};

export default meta;

const spacings = [
  'spacing-0',
  'spacing-1',
  'spacing-2',
  'spacing-3',
  'spacing-4',
  'spacing-5',
  'spacing-6',
  'spacing-8',
  'spacing-10',
  'spacing-12',
];

export const AllSpacing: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Vertical Spacing Stack</h2>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
        {spacings.map((space) => (
          <div key={space} style={{ marginBottom: `var(--${space})` }}>
            <div
              style={{
                backgroundColor: 'var(--color-gray-300)',
                padding: '1rem',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              {space}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '2px' }}>
              var(--{space})
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
