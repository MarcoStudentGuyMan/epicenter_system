import React from 'react';
import styles from '../styles/JoinUs.module.css'; // Use CSS module

function TermsOfUse() {

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
        <h1>EPICENTER TERMS OF USE </h1>
        <p className={styles.contactHeader}>
        
Welcome to Epicenter. By using our website, you agree to the following terms and conditions. You must be of legal age in your area to use this site, and you agree to provide accurate information when requested. All content on this site, including text, images, and graphics, is owned by Epicenter and is protected by copyright laws. You are not permitted to reproduce or distribute any content without our written consent. You agree not to use the site for unlawful purposes or to engage in any activity that inhibits other users' enjoyment of the site. Any content you submit, such as reviews or comments, must be your original work and must not infringe on the rights of others. Your use of the site is also governed by our Privacy Policy, and by using the site, you consent to our collection and use of your information as described therein. The site is provided "as is" without warranties of any kind. Epicenter is not liable for any damages arising from your use of the site. We reserve the right to change these terms at any time. Your continued use of the site constitutes your acceptance of any revised terms. If you have any questions about these Terms of Use, please contact us at
            <p><a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                Email: {email}
              </a> .</p>
            </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfUse;
