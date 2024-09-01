import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_mo66i0k';
const TEMPLATE_ID = 'template_nijovyp';
const USER_ID = 'LAbAgxNbNAvaBvJkN';

export const sendWelcomeEmail = async (recipientEmail, recipientName) => {
    const templateParams = {
        to_name: recipientName,
        to_email: recipientEmail,
        from_name: "Epicenter",
        message: `Your account has been successfully created. Your login email is ${recipientEmail} and your password is tenant2024.`,
    };

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            USER_ID  
        );
        console.log('Email sent successfully:', response.status, response.text);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
