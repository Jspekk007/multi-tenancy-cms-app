import { EmailPayload } from './mail.types';

export const generateWelcomeEmailContent = (
  username: string,
): Omit<EmailPayload, 'to' | 'from'> => {
  const subject = 'Welcome to Our Service!';
  const html = `
        <h1>Welcome, ${username}!</h1>
        <p>Thank you for joining our service. We're excited to have you on board.</p>
        <p>Feel free to explore and let us know if you have any questions.</p>
        <br/>
        <p>Best regards,<br/>The Team</p>
    `;
  const text = `
        Welcome, ${username}!
        
        Thank you for joining our service. We're excited to have you on board.
        
        Feel free to explore and let us know if you have any questions.
        
        Best regards,
        The Team
    `;

  return { subject, html, text };
};
