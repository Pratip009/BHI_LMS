import 'dotenv/config';
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string; // just the filename, e.g., "activation-mail.ejs"
  data: { [key: string]: any };
}

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false otherwise
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (options: EmailOptions): Promise<void> => {
  const { email, subject, template, data } = options;

  // Resolve template path using project root
  const templatePath = path.join(process.cwd(), "server/mails", template);

  try {
    // Render HTML using EJS
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} ✅`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
