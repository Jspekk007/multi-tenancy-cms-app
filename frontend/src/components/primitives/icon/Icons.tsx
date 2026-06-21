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

const DecorativeSvg: SvgIcon = ({ children, ...props }) => (
  <svg {...baseProps} {...props} aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const Add: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </DecorativeSvg>
);

export const Alert: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M12 8v4" />
    <path d="M12 15h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </DecorativeSvg>
);

export const ArrowDown: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </DecorativeSvg>
);

export const ArrowLeft: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </DecorativeSvg>
);

export const ArrowRight: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </DecorativeSvg>
);

export const ArrowUp: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </DecorativeSvg>
);

export const Check: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </DecorativeSvg>
);

export const Close: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </DecorativeSvg>
);

export const Delete: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </DecorativeSvg>
);

export const Edit: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <path d="M18.5 2.5 15.5 5.5 12 9l3.5 3.5 3.5-3.5 1.5-1.5z" />
  </DecorativeSvg>
);

export const Search: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4.5-4.5" />
  </DecorativeSvg>
);

export const Bell: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M10.27 21a2 2 0 0 0 3.46 0" />
    <path d="M4 17h16" />
    <path d="M6 17c1.1-1.28 2-2.83 2-7a4 4 0 0 1 8 0c0 4.17.9 5.72 2 7" />
  </DecorativeSvg>
);

export const HelpCircle: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.75 9.5a2.5 2.5 0 0 1 4.77 1.03c0 1.63-1.37 2.17-2.08 2.8-.38.34-.44.67-.44 1.17" />
    <path d="M12 17h.01" />
  </DecorativeSvg>
);

export const Rocket: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 4-2 4s2.74-.5 4-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </DecorativeSvg>
);

export const Tenant: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M8.5 9h7" />
    <path d="M8.5 12h7" />
    <path d="M8.5 15h4" />
  </DecorativeSvg>
);

export const Settings: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a2 2 0 1 1-2.83 2.83l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v0a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l0 0a2 2 0 1 1-2.83-2.83l0 0a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h0a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l0 0a2 2 0 1 1 2.83-2.83l0 0a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 11 3V3a2 2 0 1 1 4 0v0a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l0 0a2 2 0 1 1 2.83 2.83l0 0a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1h0a2 2 0 0 1 0 4h0a1.65 1.65 0 0 0-1.51 1Z" />
  </DecorativeSvg>
);

export const User: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
  </DecorativeSvg>
);

export const Eye: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </DecorativeSvg>
);

export const EyeOff: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M3.98 8.223A10.46 10.46 0 0 0 1 12s4 7 11 7a10.7 10.7 0 0 0 5.07-1.32" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
    <path d="M21 21 3 3" />
    <path d="M10.73 5.08A10.7 10.7 0 0 1 12 5c7 0 11 7 11 7a20.29 20.29 0 0 1-2.17 3.11" />
  </DecorativeSvg>
);

export const Media: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M10 8.5v7l5-3.5-5-3.5Z" />
    <path d="M7 7h.01" />
    <path d="M7 17h.01" />
    <path d="M17 7h.01" />
    <path d="M17 17h.01" />
  </DecorativeSvg>
);

export const Users: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a2.5 2.5 0 0 0-2.5-2.5h-2" />
    <circle cx="17.5" cy="9" r="2.5" />
  </DecorativeSvg>
);

export const PanelLeft: SvgIcon = (props) => (
  <DecorativeSvg {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="M6 8h.01" />
    <path d="M6 12h.01" />
    <path d="M6 16h.01" />
  </DecorativeSvg>
);

export const DashBoard: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />
  </DecorativeSvg>
);

export const Content: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
    <path d="M8 16h5" />
  </DecorativeSvg>
);

export const Support: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M18 8a6 6 0 0 0-9.33-5" />
    <path d="M6.29 6.29A6 6 0 0 0 18 14" />
    <path d="M18 2v4" />
    <path d="M21.17 7.17 19.83 5.83" />
    <path d="M22 12h-4" />
    <path d="M22 16h-4" />
    <path d="M3 12h4" />
    <path d="M3 16h4" />
  </DecorativeSvg>
);

export const Logs: SvgIcon = (props) => (
  <DecorativeSvg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <path d="M8.5 7h.01" />
    <path d="M8.5 11h.01" />
    <path d="M8.5 15h.01" />
    <path d="M12.5 7h.01" />
    <path d="M12.5 11h.01" />
    <path d="M12.5 15h.01" />
    <path d="M16.5 7h.01" />
    <path d="M16.5 11h.01" />
    <path d="M16.5 15h.01" />
  </DecorativeSvg>
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
  bell: Bell,
  'help-circle': HelpCircle,
  rocket: Rocket,
  tenant: Tenant,
  settings: Settings,
  user: User,
  eye: Eye,
  'eye-off': EyeOff,
  media: Media,
  users: Users,
  'panel-left': PanelLeft,
  dashboard: DashBoard,
  content: Content,
  support: Support,
  logs: Logs,
} as const;

export type IconName = keyof typeof Icons;
