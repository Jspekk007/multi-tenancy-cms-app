import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Design System/Layout/Grid',
};

export default meta;

export const GridDemo: StoryObj = {
  render: () => {
    const [columns, setColumns] = useState(3);
    const [rows, setRows] = useState(2);

    const items = Array.from({ length: columns * rows }, (_, i) => i + 1);

    return (
      <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <label>
            Columns:
            <input
              type="number"
              min={1}
              max={12}
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              style={{ marginLeft: '0.5rem', width: '3rem' }}
            />
          </label>
          <label>
            Rows:
            <input
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              style={{ marginLeft: '0.5rem', width: '3rem' }}
            />
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 80px)`,
            gap: '1rem',
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
