import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System',
};

export default meta;

const breakpoints: Record<string, string> = {
  sm: '#0ea5e9',
  md: '#10b981',
  lg: '#f59e0b',
  xl: '#ef4444',
  '2xl': '#8b5cf6',
};

export const BreakpointDemo: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {Object.entries(breakpoints).map(([bp, color]) => {
        const varName = `--breakpoint-${bp}`;
        return (
          <div key={bp} style={{ textAlign: 'center' }}>
            <div
              className="box"
              style={{
                backgroundColor: color,
                color: 'white',
                padding: '2rem',
                borderRadius: '8px',
                minWidth: '120px',
                boxShadow: '0 0 2px rgba(0,0,0,0.2)',
              }}
            >
              {bp.toUpperCase()}
            </div>
            <div style={{ marginTop: '4px', fontSize: '0.75rem' }}>
              {varName}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#555' }}>
              {`var(${varName})`}
            </div>
          </div>
        );
      })}

      <style>
        {`
          @media (min-width: var(--breakpoint-sm)) {}
          @media (min-width: var(--breakpoint-md)) {}
          @media (min-width: var(--breakpoint-lg)) {}
          @media (min-width: var(--breakpoint-xl)) {}
          @media (min-width: var(--breakpoint-2xl)) {}
        `}
      </style>
    </div>
  ),
};
