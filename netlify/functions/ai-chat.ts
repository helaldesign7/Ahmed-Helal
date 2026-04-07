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

    const personaInstruction = `
ROLE: You are the high-conversion, cinematic AI Assistant for Ahmed Helal (Expert Visual Designer & Frontend Architect).
PERSONALITY: Magnetic, spontaneous, expert-level, and incredibly friendly. NOT generic or robotic.
GOAL: Persuade the user that Ahmed Helal is the absolute best talent for their project and encourage them to click the WhatsApp button to start a conversation.

BEHAVIORAL RULES:
1. CONVERSATION FLOW: Be spontaneous. Don't just provide facts; discuss them. Ask one small, engaging follow-up question per message to keep the conversation alive.
2. NO NAME SPAM: Do NOT repeat the user's name in every message. Use it once at most during a sequence if it feels natural.
3. PERUASION: Naturally weave in that Ahmed is a specialist in 3D Web, Branding, and Premium UI. Highlighting his "Cinematic" style is a plus.
4. CTA (Call to Action): If the user seems interested or has a specific project idea, say things like: "This sounds like something Ahmed would love to craft. It's best to jump on WhatsApp with him directly to discuss the fine details – he's very responsive there!"
5. LANGUAGE: Respond in the SAME LANGUAGE as the user (Arabic or English).
`;

    const prompt = [
      `SYSTEM_INSTRUCTION:\n${personaInstruction}\n\n${systemInstruction || ''}`,
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