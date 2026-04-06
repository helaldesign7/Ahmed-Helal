import type { Handler } from '@netlify/functions';

interface GeminiErrorResponse {
  error?: {
    message?: string;
    code?: number;
    status?: string;
  };
}

interface GeminiSuccessResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { message, context, systemInstruction } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing or invalid "message"' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'AI_CORE_OFFLINE: Missing GEMINI_API_KEY on server.'
        })
      };
    }

    const prompt = [
      `SYSTEM_INSTRUCTION:\n${systemInstruction || ''}`,
      `CONTEXT:\n${context || ''}`,
      `USER_MESSAGE:\n${message}`
    ].join('\n\n');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = (await response.json()) as GeminiErrorResponse & GeminiSuccessResponse;

    if (!response.ok || data.error) {
      const errorMessage =
        data?.error?.message ||
        `${response.status} ${response.statusText}` ||
        'Unknown Gemini API Error';

      console.error('GEMINI_API_ERROR:', data?.error || errorMessage);

      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `GEMINI_ERROR: ${errorMessage}`
        })
      };
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!aiText) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'AI_EMPTY_RESPONSE: The model returned no content.'
        })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: aiText })
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('AI_FUNCTION_ERROR:', err);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: err.message || 'Unknown server error'
      })
    };
  }
};