import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type TokenSwatch = {
  label: string;
  token: string;
};

type TokenGroup = {
  description?: string;
  name: string;
  tokens: TokenSwatch[];
};

type ContrastPair = {
  background: string;
  foreground: string;
  label: string;
};

const interactiveStates = ['default', 'hover', 'active', 'disabled'];

const interactiveGroups: TokenGroup[] = [
  {
    name: 'Interactive',
    description: 'Stateful brand colors for controls.',
    tokens: ['primary', 'secondary', 'accent'].flatMap((color) =>
      interactiveStates.map((state) => ({
        label: state === 'default' ? color : `${color} ${state}`,
        token: state === 'default' ? `--color-${color}` : `--color-${color}-${state}`,
      })),
    ),
  },
  {
    name: 'Feedback',
    description: 'Status colors and their supporting surfaces.',
    tokens: ['success', 'warning', 'danger', 'info'].flatMap((color) =>
      ['default', 'hover', 'active', 'bg', 'border', 'text'].map((state) => ({
        label: state === 'default' ? color : `${color} ${state}`,
        token: state === 'default' ? `--color-${color}` : `--color-${color}-${state}`,
      })),
    ),
  },
];

const tokenGroups: TokenGroup[] = [
  {
    name: 'Gray Scale',
    description: 'Raw neutral palette steps. These are not state tokens.',
    tokens: [
      'gray-100',
      'gray-200',
      'gray-300',
      'gray-400',
      'gray-500',
      'gray-600',
      'gray-700',
      'gray-800',
      'gray-900',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
  {
    name: 'Brand Surfaces',
    description: 'Reusable primary-tinted surfaces for navigation, panels, and highlights.',
    tokens: [
      'brand-surface-subtle',
      'brand-surface-hover',
      'brand-surface-active',
      'brand-surface-strong',
      'brand-surface-border',
      'brand-text',
      'brand-text-muted',
      'brand-icon',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
  {
    name: 'App Surfaces',
    tokens: [
      'bg-default',
      'bg-muted',
      'bg-hover',
      'bg-active',
      'surface-page',
      'surface-panel',
      'surface-raised',
      'surface-subtle',
      'surface-disabled',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
  {
    name: 'Borders & Focus',
    tokens: [
      'border-default',
      'border-muted',
      'border-strong',
      'focus-border',
      'focus-ring',
      'surface-border',
      'surface-border-strong',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
  {
    name: 'Sidebar Aliases',
    description: 'Component aliases mapped to reusable brand surface tokens.',
    tokens: [
      'sidebar-background',
      'sidebar-background-hover',
      'sidebar-background-active',
      'sidebar-border',
      'sidebar-text',
      'sidebar-text-muted',
      'sidebar-icon',
      'sidebar-accent',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
  {
    name: 'Text',
    tokens: [
      'text-default',
      'text-muted',
      'text-inverse',
      'text-link',
      'text-link-hover',
    ].map((color) => ({ label: color, token: `--color-${color}` })),
  },
];

const contrastPairs: ContrastPair[] = [
  { background: '--color-primary', foreground: '--color-on-primary', label: 'on primary' },
  { background: '--color-secondary', foreground: '--color-on-secondary', label: 'on secondary' },
  { background: '--color-accent', foreground: '--color-on-accent', label: 'on accent' },
  { background: '--color-success', foreground: '--color-on-success', label: 'on success' },
  { background: '--color-warning', foreground: '--color-on-warning', label: 'on warning' },
  { background: '--color-danger', foreground: '--color-on-danger', label: 'on danger' },
  { background: '--color-info', foreground: '--color-on-info', label: 'on info' },
];

const meta: Meta = {
  title: 'Design System',
};

export default meta;

const Swatch = ({ label, token }: TokenSwatch): JSX.Element => (
  <div style={{ minWidth: 0 }}>
    <div
      style={{
        background: `var(${token})`,
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        height: '64px',
      }}
    />
    <div
      style={{
        color: 'var(--color-text-default)',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginTop: '0.35rem',
      }}
    >
      {label}
    </div>
    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
      {token}
    </div>
  </div>
);

const ColorGroup = ({ description, name, tokens }: TokenGroup): JSX.Element => (
  <section>
    <h2 style={{ fontSize: '1rem', margin: '0 0 0.25rem' }}>{name}</h2>
    {description && (
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>
        {description}
      </p>
    )}
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      }}
    >
      {tokens.map((token) => (
        <Swatch key={token.token} {...token} />
      ))}
    </div>
  </section>
);

const ContrastPairSwatch = ({ background, foreground, label }: ContrastPair): JSX.Element => (
  <div style={{ minWidth: 0 }}>
    <div
      style={{
        alignItems: 'center',
        background: `var(${background})`,
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        color: `var(${foreground})`,
        display: 'flex',
        fontSize: '1.125rem',
        fontWeight: 700,
        height: '64px',
        justifyContent: 'center',
      }}
    >
      Aa
    </div>
    <div
      style={{
        color: 'var(--color-text-default)',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginTop: '0.35rem',
      }}
    >
      {label}
    </div>
    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
      {foreground} on {background}
    </div>
  </div>
);

const ContrastPairs = (): JSX.Element => (
  <section>
    <h2 style={{ fontSize: '1rem', margin: '0 0 0.25rem' }}>Contrast Pairs</h2>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>
      Foreground tokens shown on their intended filled backgrounds.
    </p>
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      }}
    >
      {contrastPairs.map((pair) => (
        <ContrastPairSwatch key={pair.foreground} {...pair} />
      ))}
    </div>
  </section>
);

export const AllColors: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <ContrastPairs />
      {[...interactiveGroups, ...tokenGroups].map((group) => (
        <ColorGroup key={group.name} {...group} />
      ))}
    </div>
  ),
};
