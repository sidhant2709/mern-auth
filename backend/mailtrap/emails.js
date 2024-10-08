import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates.js';
import { mailtrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email address',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: 'Email Verification',
        });

        console.log(`Verification email sent to ${email}`, response);
    } catch (error) {
        console.error(`Error sending verification email to ${email} with ${error}`);
        throw new Error(`Error sending verification email to ${email} with ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: '02185902-9164-490a-9dec-1792a33702d2',
            template_variables: {
                company_info_name: 'Sid Auth Company',
                name: name,
            },
        });

        console.log(`Welcome email sent to ${email}`, response);
    } catch (error) {
        console.error(`Error sending welcome email to ${email} with ${error}`);
        throw new Error(`Error sending welcome email to ${email} with ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetPasswordUrl) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetPasswordUrl),
            category: 'Password Reset',
        });

        console.log(`Password reset email sent to ${email}`, response);
    } catch (error) {
        console.error(`Error sending password reset email to ${email} with ${error}`);
        throw new Error(`Error sending password reset email to ${email} with ${error}`);
    }
};

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password reset successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password Reset',
        });

        console.log(`Password reset success email sent to ${email}`, response);
    } catch (error) {
        console.error(`Error sending password reset success email to ${email} with ${error}`);
        throw new Error(`Error sending password reset success email to ${email} with ${error}`);
    }
};
