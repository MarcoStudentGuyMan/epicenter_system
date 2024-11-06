import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabaseConnect';

const USER_ID = 'Iutzwn27aQ8lnbhm8';
const SERVICE_ID = 'service_wzw1aga';
const TEMPLATE_ID = 'template_o2es4dm';

export const sendAdminPasswordResetEmail = async (email) => {
    try {
        // Normalize email to handle case sensitivity issues
        const normalizedEmail = email.trim().toLowerCase();
        console.log('Normalized email for query:', normalizedEmail);

        // Generate a secure token and expiration time
        const resetToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

        // Update MANAGER table with the reset token and expiry time
        const { data, error } = await supabase
            .from('MANAGER')
            .update({
                reset_token: resetToken,
                reset_token_expires: expiresAt.toISOString(),
            })
            .eq('Manager_Email', normalizedEmail)
            .select();

        // Debugging: Check the response from the update query
        console.log('Supabase update response:', { data, error });

        // Check if there was an error or if no data was returned (no matching manager found)
        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
        if (!data || data.length === 0) {
            throw new Error('No matching manager found for the provided email.');
        }

        // Construct the reset link
        const resetLink = `${window.location.origin}/Admin-PasswordRecovery?token=${resetToken}`;
        console.log('Generated reset link:', resetLink);

        // Send email via EmailJS
        const templateParams = {
            to_email: normalizedEmail,
            reset_link: resetLink,
        };

        const emailResponse = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
        console.log('EmailJS response:', emailResponse);

        return { success: true };
    } catch (error) {
        console.error('Error sending password reset email:', error.message);
        return { success: false, error: error.message };
    }
};
