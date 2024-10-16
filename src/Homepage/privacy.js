import React from 'react';
import styles from '../styles/JoinUs.module.css'; // Use CSS module

function Privacy() {

const email = "epicenteradmin@gmail.com";
  const subject = "PRIVACY POLICY";
  const body = "Hello Admin,\n\nI have questions regarding the privacy policy.\n\nBest regards,\n[Your Name]";

  return (
    <div className={styles.contactInfo}>
      <div
      className={styles.joinUsContainer}
      style={{
        backgroundImage: `url("/maplink.jpg")`, // Path to image in the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: 'vh', // Ensures full viewport height
        width: '100vw', // Ensures full viewport width
        top: 0,
        left: 0,
      }}
    >
        <div className={styles.transparentBox}>
        <h1>EPICENTER PRIVACY POLICY </h1>
        <p className={styles.contactHeader}>
        Privacy Epicenter is dedicated to safeguarding your privacy. This statement outlines our practices concerning the collection, use, and protection of your information.
            <p>
            Data Collection
            Personal Data: We may gather personal information such as your name, email address, and other contact details if you provide them.

            Usage Data: We collect information related to your interactions with our website, such as IP addresses and browsing activity.
            </p>
            <p>
            Data Usage
            Service Provision: To respond to inquiries and provide information about our food park.

            Website Enhancement: To improve our website’s functionality and content based on usage data.

            Marketing: To send you updates and promotional materials, with your consent.
            </p>
            <p>
            Data Sharing
            Your information is not shared with third parties except in the following cases:
            </p>
            <p>
            Consent: When you explicitly allow us to share your data.
            </p>
            <p>
            Legal Obligations: When required by law.
            </p>
            <p>
            Security Measures
            We implement reasonable measures to protect your personal data. However, no internet-based service is fully secure.
            </p>
            <p>
            Policy Updates
            We may update this privacy statement periodically. Changes will be posted on this page.
            </p>
            Contact Information
            For questions or concerns, please reach out to us at
            <p><a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                Email: {email}
              </a> .</p>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
