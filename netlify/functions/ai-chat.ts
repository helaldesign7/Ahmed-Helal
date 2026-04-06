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

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: 'user', 
          parts: [{ 
            text: `SYSTEM_INSTRUCTION:\n${systemInstruction}\n\nCONTEXT:\n${context}\n\nUSER_MESSAGE:\n${message}` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('GENIMIAL_API_ERROR:', data.error);
      return { 
        statusCode: 502, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `GEMINI_ERROR: ${data.error.message || 'Unknown API Error'}` }) 
      };
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!aiText) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'AI_EMPTY_RESPONSE: The model returned no content.' }) 
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: aiText }),
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
