import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, whatsapp, serviceType, projectTitle, description, budget, timeline, company } = data;

    if (!name || !email || !description) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required fields (Name, Email, Description)' }) 
      };
    }

    // 🔥 Fix: define port properly
    const port = Number(process.env.SMTP_PORT) || 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    // 🏆 Email Template
    const htmlBody = `
      <h2>New Project Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
      <p><strong>Company:</strong> ${company || 'Individual'}</p>
      <p><strong>Service:</strong> ${serviceType}</p>
      <p><strong>Project Title:</strong> ${projectTitle}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      <hr/>
      <p>${description}</p>
    `;

    await transporter.sendMail({
      from: `"Ahmed Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `🚀 New Project: ${name}`,
      html: htmlBody,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };

  } catch (error: unknown) {
    const err = error as Error;
    console.error('MAILER ERROR:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Backend Failure', details: err.message }),
    };
  }
};