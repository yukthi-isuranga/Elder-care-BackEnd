// src/utils/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Better compatibility for some environments
  },
});

export const sendApprovalEmail = async (to: string, name: string) => {
  console.log(`📧 Attempting to send approval email to: ${to}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials are NOT configured in .env');
    throw new Error('Email credentials missing');
  }

  try {
    const info = await transporter.sendMail({
      from: `"Care System" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Caregiver Profile Approved 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Congratulations ${name}!</h2>
          <p>Your caregiver profile has been approved.</p>
          <p>You can now start accepting jobs on our platform.</p>
          <p>Best regards,<br/>The Care System Team</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
