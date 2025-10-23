import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const variables: Record<string, string[]> = {
  Radius: [
    'radius-none',
    'radius-sm',
    'radius-md',
    'radius-lg',
    'radius-full',
  ],
  Shadow: [
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
  ],
  'Z-Index': [
    'z-index-dropdown',
    'z-index-modal',
    'z-index-toast',
  ],
};

const meta: Meta = {
  title: 'Design System',
};

export default meta;

export const AllMisc: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem' }}>
      {Object.entries(variables).map(([groupName, vars]) => (
        <div key={groupName}>
          <h3 style={{ marginBottom: '1rem' }}>{groupName}</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1rem',
            }}
          >
            {vars.map((v) => {
              const varValue = `var(--${v})`;
              let style: React.CSSProperties = {};

              if (groupName === 'Radius') {
                style = {
                  backgroundColor: 'var(--color-gray-300)',
                  height: '50px',
                  width: '100px',
                  borderRadius: varValue,
                  boxShadow: '0 0 2px rgba(0,0,0,0.2)',
                  margin: '0 auto',
                };
              } else if (groupName === 'Shadow') {
                style = {
                  backgroundColor: 'var(--color-gray-100)',
                  height: '50px',
                  width: '100px',
                  borderRadius: '8px',
                  boxShadow: varValue,
                  margin: '0 auto',
                };
              } else if (groupName === 'Z-Index') {
                style = {
                  backgroundColor: 'var(--color-gray-500)',
                  height: '50px',
                  width: '100px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  zIndex: `var(--${v})` as unknown as number,
                };
              }

              return (
                <div key={v} style={{ textAlign: 'center' }}>
                  <div style={style} />
                  <div style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                    {v}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#555' }}>
                    {varValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  ),
};
