import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Design System',
};

export default meta;

export const A11yHelpers: StoryObj = {
  render: () => (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <p>
          This is some content before the main area. Press <kbd>Tab</kbd> to focus the skip link.
        </p>
      </div>

      <div>
        <p>
          <span className="visually-hidden">Screen reader only text: </span>
          This text has a hidden prefix for screen readers.
        </p>
      </div>

      <div>
        <button className="focus-outline" style={{ padding: '0.5rem 1rem' }}>
          Focus me
        </button>
      </div>

      <div style={{ width: '200px', border: '1px solid #ccc' }}>
        <p className="text-truncate">
          This is a very long text that will be truncated with an ellipsis when it overflows the
          container.
        </p>
      </div>
    </div>
  ),
};
