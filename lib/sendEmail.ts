import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactEmail(name: string, email: string, message: string) {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER, // jo email receive kare
    subject: `Contact Us Form: ${name}`,
    text: message,
    html: `<p>${message}</p><p>From: ${name} (${email})</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
