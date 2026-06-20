export const getAvatarInitials = (email?: string): string => {
  if (!email) return 'U';

  const [localPart] = email.split('@');
  return localPart.slice(0, 2).toUpperCase();
};
