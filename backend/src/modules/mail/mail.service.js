import { config } from '@backend/lib/config';
import { customLogger } from '@backend/lib/logger';
import { renderTemplate } from '@backend/modules/mail/mail.utils';
import nodemailer from 'nodemailer';
let transporter = null;
const getTransporter = async () => {
    if (transporter)
        return transporter;
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
    });
    customLogger.info(`Email transporter initialised. Preview URL: ${testAccount.web}`);
    return transporter;
};
export const sendMail = async (payload) => {
    const client = await getTransporter();
    const { html, text } = await renderTemplate(payload.template, payload.context);
    try {
        const info = await client.sendMail({
            from: process.env.MAIL_FROM,
            to: payload.to,
            subject: payload.subject,
            html,
            text,
        });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            customLogger.info(`🔗 Preview: ${previewUrl}`);
        }
    }
    catch (error) {
        customLogger.error(`❌ Failed to send email [${payload.template}]: ${String(error)}`);
        throw error;
    }
};
//# sourceMappingURL=mail.service.js.map