import type { FC, SVGProps } from 'react';

export type SvgIcon = FC<SVGProps<SVGSVGElement>>;

const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const Add: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const Alert: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 8v4" />
    <path d="M12 15h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </svg>
);

export const ArrowDown: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export const ArrowLeft: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export const ArrowRight: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowUp: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const Check: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Close: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Delete: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

export const Edit: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <path d="M18.5 2.5 15.5 5.5 12 9l3.5 3.5 3.5-3.5 1.5-1.5z" />
  </svg>
);

export const Search: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4.5-4.5" />
  </svg>
);

export const Settings: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a2 2 0 1 1-2.83 2.83l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v0a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l0 0a2 2 0 1 1-2.83-2.83l0 0a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h0a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l0 0a2 2 0 1 1 2.83-2.83l0 0a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 11 3V3a2 2 0 1 1 4 0v0a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l0 0a2 2 0 1 1 2.83 2.83l0 0a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1h0a2 2 0 0 1 0 4h0a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const User: SvgIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
  </svg>
);

// Mapping
export const Icons = {
  add: Add,
  alert: Alert,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  check: Check,
  close: Close,
  delete: Delete,
  edit: Edit,
  search: Search,
  settings: Settings,
  user: User,
} as const;

export type IconName = keyof typeof Icons;
