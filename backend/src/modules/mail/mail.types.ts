type PasswordResetData = {
  template: 'password-reset';
  context: { name: string; resetLink: string };
};

type MagicLinkData = {
  template: 'magic-link';
  context: { loginUrl: string };
};

type NotificationData = {
  template: 'notification';
  context: { message: string; actionUrl?: string };
};

type WelcomeData = {
  template: 'welcome';
  context: { name: string; domain: string };
};

export type MailPayload = { to: string; subject: string } & (
  | PasswordResetData
  | MagicLinkData
  | NotificationData
  | WelcomeData
);
