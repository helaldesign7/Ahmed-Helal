import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, context, systemInstruction } = JSON.parse(event.body || '{}');
    const apiKey = process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'AI_CORE_OFFLINE: Missing API Key on server.' }) 
      };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: 'user', 
          parts: [{ text: `CONTEXT:\n${context}\n\nUSER_MESSAGE: ${message}` }] 
        }],
        system_instruction: {
          parts: [{ text: systemInstruction }]
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return { 
        statusCode: data.error.code || 500, 
        body: JSON.stringify({ error: data.error.message }) 
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || '' 
      }),
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('AI_FUNCTION_ERROR:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
