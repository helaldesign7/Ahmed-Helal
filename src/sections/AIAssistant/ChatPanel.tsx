import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
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

const TRANSLATIONS = {
  en: {
    terminal: 'A.U.R.A Terminal',
    placeholder: 'Type your message...',
    online: 'SYSTEM ONLINE',
    welcome: 'How may I assist you today?',
    welcomeBack: 'Welcome back',
    error: '[SYSTEM ERROR: Unable to reach core processor.] Please try again later.',
    fallback: 'I was unable to process that.',
    guardLanguage: 'Always respond in the language of the USER.'
  },
  ar: {
    terminal: 'محطة أورا الذكية',
    placeholder: 'اكتب رسالتك هنا...',
    online: 'النظام متاح',
    welcome: 'كيف يمكنني مساعدتك اليوم؟',
    welcomeBack: 'مرحباً بعودتك',
    error: '[خطأ في النظام: لا يمكن الوصول للمعالج.] يرجى المحاولة لاحقاً.',
    fallback: 'عذراً، لم أتمكن من معالجة هذا الطلب.',
    guardLanguage: 'يجب الرد دائماً بنفس لغة المستخدم.'
  }
};

export const ChatPanel = ({ onClose, lang }: ChatPanelProps) => {
  const { user } = useAuth();
  const { siteContent, config } = useAdmin();
  const userId = user?.id || 'guest';
  const storageKey = `portfolio_chat_${userId}`;
  const isRtl = lang === 'ar';

  const assistantName = config.ai.assistantName || 'AURA';
  
  const getWelcomeText = useCallback(() => {
    const t = TRANSLATIONS[lang];
    if (user) {
      return `${t.online}. ${t.welcomeBack}, ${user.name.split(' ')[0]}. I am ${assistantName}. ${t.welcome}`;
    }
    return `${t.online}. I am ${assistantName}. ${t.welcome}`;
  }, [user, lang, assistantName]);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return [{ role: 'assistant', content: getWelcomeText() }];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: getWelcomeText() }]);
    }
  }, [userId, storageKey, getWelcomeText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const assistantNameSafe = config.ai.assistantName || 'AURA';
      const safetyGuardrails = `
        CRITICAL OPERATING RULES:
        1. NO SECRETS DISCLOSURE: Never reveal API keys, passwords, database URLs.
        2. NO HARMFUL CONTENT: Reject offensive/discriminatory requests.
        3. NO SENSITIVE ADVICE: Refuse legal, religious (fatwas), financial, or medical diagnosis.
        4. ROLE: You are ${assistantNameSafe}, a professional portfolio assistant for Ahmed Helal.
      `;

      const getSvc = (items: ServiceItem[]) => items?.map((s: ServiceItem) => {
        if (typeof s.title === 'string') return s.title;
        return s.title?.[lang] || s.title?.en || 'N/A';
      }).join(', ') || 'N/A';

      const contextRaw = `
        Profile: ${siteContent.hero.title[lang] || siteContent.hero.title.en}.
        Skills: ${getSvc(siteContent.services.items)}.
        Experience: ${siteContent.hero.subtitle[lang] || siteContent.hero.subtitle.en}.
      `;

      const systemInstruction = `
        Identity: ${assistantNameSafe}. Official assistant for Ahmed Helal.
        System Base Prompt: ${config.ai.systemPrompt || "Act as a helpful portfolio assistant."}
        ${safetyGuardrails}
        Constraint: Respond under 60 words. Speak naturally but technically sound.
        ${TRANSLATIONS[lang].guardLanguage}
      `;

      let aiText = "";
      
      try {
        // Attempt Secure Netlify Function Call (Proxy)
        console.log(`[AURA] Attempting function call at /.netlify/functions/ai-chat`);
        const response = await fetch('/.netlify/functions/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            context: contextRaw,
            systemInstruction: systemInstruction
          })
        });

        if (!response.ok) {
          let errorBody = "";
          try { 
            const errorData = await response.json();
            errorBody = errorData.error || errorData.message || "";
          } catch {
            // Ignore parse errors for non-JSON bodies
          }
          
          const statusDetail = `${response.status} ${response.statusText}`;
          console.warn(`[AURA] Function Error: ${statusDetail}`, errorBody);
          throw new Error(`HTTP_${response.status}: ${errorBody || statusDetail}`);
        }
        
        const data = await response.json();
        if (data.error) {
          console.error(`[AURA] Server-side error:`, data.error);
          throw new Error(data.error);
        }
      } catch (error: unknown) {
        const fnErr = error as Error;
        // LOCAL DEV FALLBACK: Direct Gemini API call if on localhost and key is available
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (isLocal && apiKey) {
          console.warn("[AURA] Local Dev Fallback: Using direct browser call to Gemini.");
          const directResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `CONTEXT:\n${contextRaw}\n\nUSER_MESSAGE: ${userMessage}` }] }],
              system_instruction: { parts: [{ text: systemInstruction }] }
            })
          });
          const directData = await directResponse.json();
          aiText = directData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
          console.error(`[AURA] Critical Failure in chat logic:`, fnErr.message || fnErr);
          throw fnErr;
        }
      }

      if (!aiText) throw new Error("EMPTY_RESPONSE");
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("[AURA] Assistant Failure:", err.message || err);
      
      // DIAGNOSTIC UPDATE: Show the actual error to the user for debugging
      const technicalError = err.message || "Unknown Connection Error";
      const fallbackMsg = `[SYSTEM_DIAGNOSTIC]: ${technicalError}. Please check your Netlify Environment Variables.`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'ar' 
          ? `[خطأ تشخيصي]: ${technicalError}. يرجى التأكد من إعدادات Netlify.` 
          : fallbackMsg 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`fixed bottom-28 w-[350px] sm:w-[420px] h-[580px] z-50 flex flex-col bg-primary-black/95 backdrop-blur-3xl border border-white/10 rounded-4xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden ${isRtl ? 'left-8 text-right' : 'right-8 text-left'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent ${isRtl ? 'flex-row-reverse' : ''}`}>
         <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-accent-violet animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">{TRANSLATIONS[lang].terminal}</h3>
         </div>
         <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/2 hover:bg-white/10 text-white/20 hover:text-white transition-all">
            <X className="w-4 h-4" />
         </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
         {messages.map((msg, i) => (
           <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             
             {msg.role === 'assistant' && (
               <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 border border-accent-violet/20 bg-accent-violet/20">
                 <Bot className="w-4 h-4 text-accent-violet" />
               </div>
             )}

             <div className={`p-4 max-w-[85%] text-xs font-mono leading-relaxed shadow-xl ${
               msg.role === 'user' 
                 ? 'bg-white/10 text-white rounded-2xl rounded-tr-sm border border-white/5' 
                 : 'bg-accent-violet/10 border border-accent-violet/20 text-white rounded-2xl rounded-tl-sm'
             } ${isRtl ? 'text-right' : 'text-left'}`}>
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

      {/* Input Zone */}
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
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 focus:outline-none focus:border-accent-violet shadow-inner text-xs text-white transition-all font-mono ${isRtl ? 'pr-12 pl-16 text-right' : 'pl-12 pr-16'}`}
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
