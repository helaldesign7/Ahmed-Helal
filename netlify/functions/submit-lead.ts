import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

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

    // 1. Initialize Supabase Admin Client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    // Use SERVICE_ROLE_KEY if available, otherwise fallback to ANON_KEY (RLS allows public inserts)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase Environment Variables setup in Netlify');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server DB Configuration Missing' }) };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Map payload to strict lowercase leads schema (matches DB format accurately)
    const payload = {
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp?.trim() || '',
      company: company?.trim() || 'Individual',
      interest: serviceType || '',
      projecttitle: projectTitle?.trim() || 'New Project Inquiry',
      description: description.trim(),
      budget: budget || '',
      timeline: timeline || '',
      status: 'pending',
      date: new Date().toISOString()
    };

    // 3. Insert into Supabase First
    const { error: dbError } = await supabase.from('leads').insert([payload]);

    if (dbError) {
      console.error('SUPABASE INSERT ERROR:', dbError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Database Persistence Failed', details: dbError.message }) 
      };
    }

    // 4. Send Email Notification Second
    let emailSent = false;
    try {
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

      const htmlBody = `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <div style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">🚀 New Project Inquiry</h2>
            <p style="color: #e2e8f0; margin-top: 8px; font-size: 15px; opacity: 0.9;">You have a new message from <strong>${name}</strong></p>
          </div>
          
          <div style="padding: 32px 24px;">
            <!-- Contact Details -->
            <div style="margin-bottom: 24px; background-color: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #60a5fa; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Contact Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
                <tr><td style="padding-bottom: 8px; width: 100px; color: #94a3b8;">Name:</td><td style="padding-bottom: 8px; font-weight: 500;">${name}</td></tr>
                <tr><td style="padding-bottom: 8px; color: #94a3b8;">Email:</td><td style="padding-bottom: 8px;"><a href="mailto:${email}" style="color: #93c5fd; text-decoration: none; font-weight: 500;">${email}</a></td></tr>
                <tr><td style="padding-bottom: 8px; color: #94a3b8;">WhatsApp:</td><td style="padding-bottom: 8px;">${whatsapp || '<span style="color: #64748b;">N/A</span>'}</td></tr>
                <tr><td style="color: #94a3b8;">Company:</td><td>${company || '<span style="color: #64748b;">Individual</span>'}</td></tr>
              </table>
            </div>

            <!-- Project Scope -->
            <div style="margin-bottom: 24px; background-color: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #a78bfa; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Project Scope</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
                <tr><td style="padding-bottom: 8px; width: 100px; color: #94a3b8;">Service:</td><td style="padding-bottom: 8px; font-weight: 500;">${serviceType || 'Not specified'}</td></tr>
                <tr><td style="padding-bottom: 8px; color: #94a3b8;">Title:</td><td style="padding-bottom: 8px; font-weight: 500;">${projectTitle || 'N/A'}</td></tr>
                <tr><td style="padding-bottom: 8px; color: #94a3b8;">Budget:</td><td style="padding-bottom: 8px;"><span style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 2px 10px; border-radius: 12px; font-weight: bold; font-size: 13px; border: 1px solid rgba(16, 185, 129, 0.3);">${budget || 'Custom'}</span></td></tr>
                <tr><td style="color: #94a3b8;">Timeline:</td><td>${timeline || 'Flexible'}</td></tr>
              </table>
            </div>

            <!-- Description -->
            <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #fbbf24; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
              <div style="margin: 0; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; font-size: 15px;">${description}</div>
            </div>
          </div>
          
          <div style="background-color: #020617; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #1e293b;">
            <p style="margin: 0;">This email was automatically generated from your Portfolio Website.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Ahmed Portfolio" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_TO || process.env.SMTP_USER,
        subject: `🚀 New Project: ${name}`,
        html: htmlBody,
      });

      emailSent = true;
    } catch (mailErr) {
      console.error('MAILER ERROR (Non-Fatal):', mailErr);
      // Non-fatal because the DB insert succeeded
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        emailSent, 
        message: emailSent ? 'Lead captured and notification sent' : 'Lead captured successfully but email delivery failed'
      }),
    };

  } catch (error: unknown) {
    const err = error as Error;
    console.error('BACKEND ERROR:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Backend Failure', details: err.message }),
    };
  }
};