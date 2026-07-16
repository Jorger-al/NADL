import emailjs from "@emailjs/browser";

/**
 * EmailJS configuration.
 *
 * To obtain these values:
 *  1. Create a free account at https://www.emailjs.com
 *  2. Go to "Email Services" → "Add New Service" and connect your Gmail / Outlook / etc.
 *  3. Go to "Email Templates" → "Create New Template" and use the variables:
 *       {{to_email}}  {{to_name}}  {{verification_url}}
 *  4. Copy the Service ID, Template ID and Public Key below.
 *
 * Store these in a .env file at project root:
 *   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends a verification email to a newly registered user.
 *
 * @param {object} params
 * @param {string} params.toEmail          - Recipient email address
 * @param {string} params.toName           - Recipient full name
 * @param {string} params.verificationUrl  - Full URL with ?token=...
 */
export async function sendVerificationEmail({ toEmail, toName, verificationUrl }) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error(
            "EmailJS is not configured. Please set VITE_EMAILJS_SERVICE_ID, " +
            "VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in your .env file."
        );
    }

    const templateParams = {
        to_email:         toEmail,
        to_name:          toName,
        verification_url: verificationUrl,
        // Extra convenience variable used in some templates:
        app_name:         "Nautical Archive Digital Library",
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}
