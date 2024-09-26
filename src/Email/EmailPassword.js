import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_mo66i0k';
const TEMPLATE_ID = 'template_pzrllty';
const USER_ID = 'LAbAgxNbNAvaBvJkN';

export const sendPasswordResetEmail = async (recipientEmail, resetLink) => {
    const templateParams = {
        to_email: recipientEmail,
        reset_link: resetLink,
        from_name: "Epicenter",
        message: "Click the link below to reset your password",
    };

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            USER_ID
        );
        console.log('Password reset email sent successfully:', response.status, response.text);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};