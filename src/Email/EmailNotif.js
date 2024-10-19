import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_fynrbm8';
const TEMPLATE_ID = 'template_l62iwdo'; // Replace with your existing template ID
const USER_ID = 'qAHB48By2X_9sICiJ';

export const sendEmailNotif = async (recipientEmail, recipientName, subject, message) => {
    const templateParams = {
        to_name: recipientName,
        to_email: recipientEmail,
        from_name: 'Epicenter',
        subject: subject,
        message: message,
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
