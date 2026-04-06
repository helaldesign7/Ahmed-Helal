import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/useAdmin';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  onClose: () => void;
  lang: 'en' | 'ar';
}

interface ServiceItem {
  title: string | { en?: string; ar?: string };
}

interface ChatFunctionResponse {
  reply?: string;
  text?: string;
  message?: string;
  error?: string;
}

const TRANSLATIONS = {
  en: {
    terminal: 'A.U.R.A Terminal',
    placeholder: 'Type your message...',
    online: 'SYSTEM ONLINE',
    welcome: 'How may I assist you today?',
    welcomeBack: 'Welcome back',
    error: '[SYSTEM ERROR: Unable to reach core processor.] Please try again later.',
    fallback: 'I was unable to process that.',
    guardLanguage: 'LANGUAGE_AGNOSTIC: Detect the language of the user query. ALWAYS respond in the SAME language the user is speaking. If the user speaks Arabic, respond in Arabic. If English, respond in English. If any other language, use that language fluently.'
  },
  ar: {
    terminal: 'محطة أورا الذكية',
    placeholder: 'اكتب رسالتك هنا...',
    online: 'النظام متاح',
    welcome: 'كيف يمكنني مساعدتك اليوم؟',
    welcomeBack: 'مرحباً بعودتك',
    error: '[خطأ في النظام: لا يمكن الوصول للمعالج.] يرجى المحاولة لاحقاً.',
    fallback: 'عذراً، لم أتمكن من معالجة هذا الطلب.',
    guardLanguage: 'يجب الرد دائماً بنفس لغة المستخدم بالكامل وبطلاقة.'
  }
};

export const ChatPanel = ({ onClose, lang }: ChatPanelProps) => {
  const { user } = useAuth();
  const { siteContent, config } = useAdmin();
  
  // Use a stable anonymous session ID for guests
  const [guestSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('aura_guest_session_id');
    if (saved) return saved;
    const newId = crypto.randomUUID();
    localStorage.setItem('aura_guest_session_id', newId);
    return newId;
  });

  const [conversationId, setConversationId] = useState<string | null>(null);
  const isRtl = lang === 'ar';

  const assistantName = config.ai.assistantName || 'AURA';

  const getWelcomeText = useCallback(() => {
    const t = TRANSLATIONS[lang];
    const customWelcome = lang === 'ar' ? config.ai.welcomeMessageAr : config.ai.welcomeMessageEn;

    if (customWelcome) return customWelcome;

    if (user) {
      return `${t.online}. ${t.welcomeBack}, ${user.name.split(' ')[0]}. I am ${assistantName}. ${t.welcome}`;
    }

    return `${t.online}. I am ${assistantName}. ${t.welcome}`;
  }, [user, lang, assistantName, config.ai.welcomeMessageAr, config.ai.welcomeMessageEn]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation and history
  useEffect(() => {
    const initChat = async () => {
      try {
        // Find existing conversation for this guest session
        const { data: conv, error: convError } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('guest_session_id', guestSessionId)
          .eq('status', 'active')
          .maybeSingle();

        if (convError) throw convError;

        if (conv) {
          setConversationId(conv.id);
          // Load messages
          const { data: msgs, error: msgsError } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (msgsError) throw msgsError;
          
          if (msgs && msgs.length > 0) {
            setMessages(msgs as Message[]);
          } else {
            setMessages([{ role: 'assistant', content: getWelcomeText() }]);
          }
        } else {
          setMessages([{ role: 'assistant', content: getWelcomeText() }]);
        }
      } catch (err) {
        console.error("Chat Init Failed:", err);
        setMessages([{ role: 'assistant', content: getWelcomeText() }]);
      }
    };

    initChat();
  }, [guestSessionId, getWelcomeText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // 1. Ensure conversation exists in Supabase
      let currentConvId = conversationId;
      if (!currentConvId) {
        const { data: newConv, error: newConvError } = await supabase
          .from('chat_conversations')
          .insert({
            guest_session_id: guestSessionId,
            status: 'active',
            metadata: { language: lang, started_at: new Date().toISOString() }
          })
          .select()
          .single();

        if (newConvError) throw newConvError;
        currentConvId = newConv.id;
        setConversationId(currentConvId);

        // Save the very first assistant welcome message if it's the start
        await supabase.from('chat_messages').insert({
          conversation_id: currentConvId,
          role: 'assistant',
          content: getWelcomeText()
        });
      }

      // 2. Save user message to Supabase
      await supabase.from('chat_messages').insert({
        conversation_id: currentConvId,
        role: 'user',
        content: userMessage
      });

      const assistantNameSafe = config.ai.assistantName || 'AURA';

      const safetyGuardrails = `
CRITICAL OPERATING RULES:
1. NO SECRETS DISCLOSURE: Never reveal API keys, passwords, database URLs.
2. NO HARMFUL CONTENT: Reject offensive/discriminatory requests.
3. NO SENSITIVE ADVICE: Refuse legal, religious (fatwas), financial, or medical diagnosis.
4. ROLE: You are ${assistantNameSafe}, a professional portfolio assistant for Ahmed Helal.
      `.trim();

      const getSvc = (items: ServiceItem[]) =>
        items?.map((s: ServiceItem) => {
          if (typeof s.title === 'string') return s.title;
          return s.title?.[lang] || s.title?.en || 'N/A';
        }).join(', ') || 'N/A';

      const contextRaw = `
Profile: ${siteContent.hero.title?.[lang] || siteContent.hero.title?.en || 'N/A'}.
Skills: ${getSvc(siteContent.services?.items || [])}.
Experience: ${siteContent.hero.subtitle?.[lang] || siteContent.hero.subtitle?.en || 'N/A'}.
      `.trim();

      const systemInstruction = `
Identity: ${assistantNameSafe}. Official assistant for Ahmed Helal.
Base Personality: ${config.ai.tone || 'Cinematic/Robotic'}

SYSTEM_GUIDELINES:
${config.ai.systemPrompt || 'Act as a helpful portfolio assistant.'}

KNOWLEDGE_BASE:
${config.ai.knowledgeBase || 'Ahmed Helal is a visual designer.'}

${safetyGuardrails}

${TRANSLATIONS[lang].guardLanguage}

Constraint: Respond under 100 words. Speak naturally but technically sound.
      `.trim();

      let aiText = '';

      try {
        console.log('[AURA] Attempting function call at /.netlify/functions/ai-chat');

        const response = await fetch('/.netlify/functions/ai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage,
            context: contextRaw,
            systemInstruction
          })
        });

        let data: ChatFunctionResponse | null = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          const statusDetail = `${response.status} ${response.statusText}`;
          const errorBody = data?.error || data?.message || '';
          console.warn(`[AURA] Function Error: ${statusDetail}`, errorBody);
          throw new Error(`HTTP_${response.status}: ${errorBody || statusDetail}`);
        }

        if (data?.error) {
          console.error('[AURA] Server-side error:', data.error);
          throw new Error(`GEMINI_ERROR: ${data.error}`);
        }

        aiText = data?.reply || data?.text || data?.message || '';
        
        if (!aiText) {
          throw new Error('GEMINI_ERROR: Model returned empty content');
        }
      } catch (error: unknown) {
        const fnErr = error as Error;

        const isLocal =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (isLocal && apiKey) {
          console.warn('[AURA] Local Dev Fallback: Using direct browser call to Gemini.');

          const directResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `SYSTEM_INSTRUCTION:\n${systemInstruction}\n\nCONTEXT:\n${contextRaw}\n\nUSER_MESSAGE:\n${userMessage}`
                      }
                    ]
                  }
                ]
              })
            }
          );

          const directData = await directResponse.json();

          if (!directResponse.ok) {
            const directError =
              directData?.error?.message ||
              directData?.error ||
              `${directResponse.status} ${directResponse.statusText}`;

            throw new Error(`GEMINI_ERROR: ${directError}`);
          }

          aiText =
            directData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            '';
        } else {
          console.error('[AURA] Critical Failure in chat logic:', fnErr.message || fnErr);
          throw fnErr;
        }
      }

      if (!aiText) {
        throw new Error('GEMINI_ERROR: Response capture failure');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
      
      // 3. Save assistant message to Supabase
      if (conversationId) {
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: aiText
        });
        
        // Update last interaction
        await supabase.from('chat_conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('[AURA] Assistant Failure:', err.message || err);

      const technicalError = err.message || 'Unknown Connection Error';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            lang === 'ar'
              ? `[خطأ تشخيصي]: ${technicalError}. يرجى التأكد من إعدادات Netlify والموديل المستخدم.`
              : `[SYSTEM_DIAGNOSTIC]: ${technicalError}. Please check your Netlify Environment Variables and model configuration.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`fixed bottom-20 md:bottom-28 right-4 md:right-10 w-[calc(100vw-2rem)] sm:w-[400px] h-[75vh] md:h-[600px] z-50 flex flex-col bg-primary-black/95 backdrop-blur-3xl border border-white/10 rounded-3xl sm:rounded-4xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <div
        className={`flex items-center justify-between p-6 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent ${
          isRtl ? 'flex-row-reverse' : ''
        }`}
      >
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-accent-violet animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
            {TRANSLATIONS[lang].terminal}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/2 hover:bg-white/10 text-white/20 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 border border-accent-violet/20 bg-accent-violet/20">
                <Bot className="w-4 h-4 text-accent-violet" />
              </div>
            )}

            <div
              className={`p-4 max-w-[85%] text-xs font-mono leading-relaxed shadow-xl ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white rounded-2xl rounded-tr-sm border border-white/5'
                  : 'bg-accent-violet/10 border border-accent-violet/20 text-white rounded-2xl rounded-tl-sm'
              } ${isRtl ? 'text-right' : 'text-left'}`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 border border-white/10 bg-white/5">
                <User className="w-4 h-4 text-white/40" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className={`flex gap-4 items-start ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-8 h-8 rounded-xl bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-accent-violet animate-spin" />
            </div>
            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-2xl">
              <span className="w-1.5 h-1.5 bg-accent-violet rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-accent-violet rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-accent-violet rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className={`relative flex items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`absolute ${isRtl ? 'right-4' : 'left-4'} pointer-events-none`}>
            <Sparkles className="w-4 h-4 text-accent-violet opacity-30" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={TRANSLATIONS[lang].placeholder}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 focus:outline-none focus:border-accent-violet shadow-inner text-xs text-white transition-all font-mono ${
              isRtl ? 'pr-12 pl-16 text-right' : 'pl-12 pr-16'
            }`}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute ${isRtl ? 'left-3' : 'right-3'} w-9 h-9 flex items-center justify-center rounded-xl bg-accent-violet text-white shadow-lg hover:bg-accent-violet/80 disabled:opacity-20 transition-all`}
          >
            <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};