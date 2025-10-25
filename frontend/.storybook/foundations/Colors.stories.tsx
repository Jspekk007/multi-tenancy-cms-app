import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const colorGroups: Record<string, string[]> = {
  Primary: ['primary', 'secondary', 'accent'],
  Feedback: ['success', 'warning', 'danger', 'info'],
  Gray: [
    'gray-100',
    'gray-200',
    'gray-300',
    'gray-400',
    'gray-500',
    'gray-600',
    'gray-700',
    'gray-800',
    'gray-900',
  ],
};

const meta: Meta = {
  title: 'Design System',
};

export default meta;

const states = ['default', 'hover', 'active', 'disabled'];

export const AllColors: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {Object.entries(colorGroups).map(([groupName, colors]) => (
        <div key={groupName}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1rem',
            }}
          >
            {colors.map((color) => (
              <div key={color} style={{ textAlign: 'center' }}>
                {/* Color Name at the top */}
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{color}</div>

                {/* Swatches for each state */}
                {states.map((state) => {
                  const varName =
                    state === 'default' ? `--color-${color}` : `--color-${color}-${state}`;
                  return (
                    <div key={state} style={{ marginBottom: '4px' }}>
                      <div
                        style={{
                          backgroundColor: `var(${varName})`,
                          height: '50px',
                          borderRadius: '8px',
                          boxShadow: '0 0 2px rgba(0,0,0,0.2)',
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{state}</div>
                      <div style={{ fontSize: '0.65rem', color: '#555' }}>{varName}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
