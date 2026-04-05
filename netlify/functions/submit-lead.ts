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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 🏆 Cinematic HTML Email Template
    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #ffffff; margin: 0; padding: 40px 20px; }
          .wrapper { max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 40px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
          .hero { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 60px 40px; text-align: center; position: relative; }
          .hero h1 { margin: 0; font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px; text-transform: uppercase; }
          .hero p { margin: 10px 0 0; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); letter-spacing: 4px; text-transform: uppercase; }
          .content { padding: 50px 40px; }
          .section-label { font-size: 9px; font-weight: 900; color: #a855f7; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 30px; display: block; border-bottom: 1px solid rgba(168,85,247,0.2); padding-bottom: 10px; }
          .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; border-radius: 24px; background: rgba(255,255,255,0.02); padding: 30px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 40px; }
          .field { margin-bottom: 0; }
          .label { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 700; }
          .value { font-size: 15px; color: #ffffff; font-weight: 600; font-family: 'Courier New', Courier, monospace; }
          .badge { display: inline-block; padding: 6px 14px; background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); border-radius: 100px; color: #a78bfa; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
          .brief-container { background: rgba(255,255,255,0.03); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
          .brief-text { font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.8); white-space: pre-wrap; font-family: 'Courier New', Courier, monospace; }
          .footer { padding: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
          .footer p { margin: 0; font-size: 10px; color: rgba(255,255,255,0.2); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
          .footer span { color: #a855f7; opacity: 0.5; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="hero">
            <p>New Intelligence Node</p>
            <h1>Mission Inquiry</h1>
          </div>
          
          <div class="content">
            <span class="section-label">Identity Data</span>
            <div class="info-grid">
              <div class="field">
                <div class="label">Client</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Entity</div>
                <div class="value">${company || 'Individual'}</div>
              </div>
              <div class="field" style="margin-top: 20px; grid-column: span 2;">
                <div class="label">Channel Info</div>
                <div class="value">${email}</div>
                <div class="value" style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 5px;">WhatsApp: ${whatsapp || 'N/A'}</div>
              </div>
            </div>

            <span class="section-label">Project Parameters</span>
            <div style="margin-bottom: 40px;">
              <div class="label">Objective</div>
              <div class="value" style="font-size: 18px; color: #a78bfa; margin-bottom: 20px;">${projectTitle || 'Unified Creative Request'}</div>
              
              <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                <span class="badge">${serviceType}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);">Budget: ${budget}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);">${timeline}</span>
              </div>
              
              <div class="label">Brief Analysis</div>
              <div class="brief-container">
                <div class="brief-text">${description.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Generated by <span>Ahmed Helal</span> Portfolio v3.5.0</p>
            <p style="margin-top: 10px; font-size: 8px; opacity: 0.5;">PI-SYSTEM // Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"AURA PI-SYSTEM" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `🚀 MISSION INQUIRY: ${name} [${serviceType}]`,
      text: `New Lead from ${name}: ${description}`,
      html: htmlBody,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('MAILER ERROR:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Backend Failure', details: err.message }),
    };
  }
};
