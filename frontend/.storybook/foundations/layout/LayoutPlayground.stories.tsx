import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Design System/Layout/Layout Playground',
};

export default meta;

export const Playground: StoryObj = {
  render: () => {
    const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
    const [flexWrap, setFlexWrap] = useState<'wrap' | 'nowrap'>('wrap');
    const [alignItems, setAlignItems] = useState<'flex-start' | 'center' | 'flex-end'>('center');
    const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'space-between' | 'flex-end'>('space-between');
    const [gridColumns, setGridColumns] = useState(3);

    const flexItems = ['Item 1', 'Item 2', 'Item 3'];
    const gridItems = Array.from({ length: gridColumns * 2 }, (_, i) => `Item ${i + 1}`);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
        <h2>Flex Playground</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label>
            Direction:
            <select value={flexDirection} onChange={(e) => setFlexDirection(e.target.value as any)}>
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </label>
          <label>
            Wrap:
            <select value={flexWrap} onChange={(e) => setFlexWrap(e.target.value as any)}>
              <option value="wrap">Wrap</option>
              <option value="nowrap">No Wrap</option>
            </select>
          </label>
          <label>
            Align Items:
            <select value={alignItems} onChange={(e) => setAlignItems(e.target.value as any)}>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
            </select>
          </label>
          <label>
            Justify Content:
            <select value={justifyContent} onChange={(e) => setJustifyContent(e.target.value as any)}>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="space-between">Space Between</option>
              <option value="flex-end">End</option>
            </select>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection,
            flexWrap,
            alignItems,
            justifyContent,
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }}
        >
          {flexItems.map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                minWidth: '60px',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <h2>Grid Playground</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Columns:
            <input
              type="number"
              min={1}
              max={6}
              value={gridColumns}
              onChange={(e) => setGridColumns(Number(e.target.value))}
            />
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          {gridItems.map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: '#0ea5e9',
                color: 'white',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                fontSize: '0.75rem',
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
