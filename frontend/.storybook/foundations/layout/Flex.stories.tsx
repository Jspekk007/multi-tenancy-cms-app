import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Layout/Flex',
};

export default meta;

export const FlexDemo: StoryObj = {
  render: () => {
    const directions = ['row', 'column'] as const;
    const wraps = ['wrap', 'nowrap'] as const;
    const aligns = ['flex-start', 'center', 'flex-end'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
        {directions.map((dir) => (
          <div key={dir}>
            <h3>Direction: {dir}</h3>
            {wraps.map((wrap) => (
              <div key={wrap} style={{ marginBottom: '1rem' }}>
                <h4>Wrap: {wrap}</h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: dir,
                    flexWrap: wrap,
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    justifyContent: 'space-between',
                  }}
                >
                  {aligns.map((align) => (
                    <div
                      key={align}
                      style={{
                        display: 'flex',
                        alignItems: align,
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#1e40af',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                      }}
                    >
                      {align}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
