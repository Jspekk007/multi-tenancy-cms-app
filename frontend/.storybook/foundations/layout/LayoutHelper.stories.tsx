import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Layout/Helpers',
};

export default meta;

export const LayoutHelpers: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      <div
        className="container"
        style={{
          maxWidth: 'var(--container-lg)',
          margin: '0 auto',
          padding: 'var(--spacing-md)',
          background: '#f3f4f6',
          borderRadius: '8px',
        }}
      >
        <p style={{ margin: 0 }}>Container (max-width: var(--container-lg))</p>
      </div>

      <div
        className="layout-center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          background: '#e0f2fe',
          borderRadius: '8px',
        }}
      >
        <span>layout-center</span>
      </div>

      <div
        className="layout-stack"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <div style={{ background: '#3b82f6', color: 'white', padding: '0.5rem' }}>Stack Item 1</div>
        <div style={{ background: '#10b981', color: 'white', padding: '0.5rem' }}>Stack Item 2</div>
        <div style={{ background: '#f59e0b', color: 'white', padding: '0.5rem' }}>Stack Item 3</div>
      </div>

      <div
        className="layout-split"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <span>Left</span>
        <span>Right</span>
      </div>
    </div>
  ),
};
