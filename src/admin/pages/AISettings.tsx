import { useState, useRef, useEffect } from 'react';
import { Save, MessageSquareText, FileCode2, SlidersHorizontal, History, Play, X, Bot, User, Loader2, Sparkles, Send } from 'lucide-react';
import { ConversationViewer } from '../components/ai/ConversationViewer';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdminConfig } from '../../types/admin';

export const AISettings = () => {
  const { config, updateAiConfig } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeTab, setActiveTab] = useState<'personality' | 'knowledge' | 'controls' | 'logs'>('personality');
  const [localAI, setLocalAI] = useState(config.ai);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'AI Architecture',
      subtitle: "Configure your virtual assistant's brain",
      updateBtn: 'Save Configuration',
      previewBtn: 'Test AI Preview',
      lastUpdated: 'Last Updated',
      tabs: {
        personality: 'Identity & Voice',
        knowledge: 'Knowledge Base',
        controls: 'Logic & Triggers',
        logs: 'Chat History'
      },
      personality: {
        title: 'Assistant Identity',
        nameLabel: 'Assistant Name',
        welcomeEnLabel: 'Welcome Message (English)',
        welcomeArLabel: 'Welcome Message (Arabic)',
        toneLabel: 'Tone of Voice Guidelines',
        tones: [
          'Cinematic / Robotic',
          'Professional / Minimal',
          'Creative / Dynamic',
          'Casual / Friendly'
        ]
      },
      knowledge: {
        title: 'Core Knowledge',
        systemPromptLabel: 'System Instruction (The "Who")',
        systemPromptDesc: 'Core behavioral rules and constraints.',
        knowledgeBaseLabel: 'Knowledge Base (The "What")',
        knowledgeBaseDesc: 'Specific facts about Ahmed, projects, and services.',
        supportMarkdown: 'Supports Markdown'
      },
      controls: {
        title: 'Interaction Logic',
        suggest: {
          title: 'Auto-Suggest Prompts',
          desc: 'AI proactively offers quick reply options.'
        },
        lead: {
          title: 'Lead Capture Focus',
          desc: 'Prioritize asking for contact info during project inquiries.'
        }
      },
      preview: {
        title: 'AI Lab Preview',
        desc: 'Test your current unsaved configuration in a safe sandbox.',
        placeholder: 'Ask the assistant something...',
        close: 'Close Lab'
      },
      saveAlert: 'AI Architecture Synchronized.'
    },
    ar: {
      title: 'هيكلية الذكاء الاصطناعي',
      subtitle: 'تكوين عقل مساعدك الافتراضي',
      updateBtn: 'حفظ التكوين',
      previewBtn: 'اختبار المعاينة',
      lastUpdated: 'آخر تحديث',
      tabs: {
        personality: 'الهوية والصوت',
        knowledge: 'قاعدة المعرفة',
        controls: 'المنطق والمشغلات',
        logs: 'سجل المحادثات'
      },
      personality: {
        title: 'هوية المساعد',
        nameLabel: 'اسم المساعد',
        welcomeEnLabel: 'رسالة الترحيب (الإنجليزية)',
        welcomeArLabel: 'رسالة الترحيب (العربية)',
        toneLabel: 'إرشادات نبرة الصوت',
        tones: [
          'سينمائي / آلي',
          'مهني / بسيط',
          'إبداعي / ديناميكي',
          'ودي / غير رسمي'
        ]
      },
      knowledge: {
        title: 'المعرفة الأساسية',
        systemPromptLabel: 'تعليمات النظام (من أنا؟)',
        systemPromptDesc: 'القواعد السلوكية والقيود الأساسية.',
        knowledgeBaseLabel: 'قاعدة البيانات (ماذا أعرف؟)',
        knowledgeBaseDesc: 'حقائق محددة عن أحمد، المشاريع، والخدمات.',
        supportMarkdown: 'يدعم الماركداون'
      },
      controls: {
        title: 'منطق التفاعل',
        suggest: {
          title: 'مقترحات تلقائية',
          desc: 'يقدم المساعد خيارات رد سريع بشكل استباقي.'
        },
        lead: {
          title: 'التركيز على بيانات العملاء',
          desc: 'إعطاء الأولوية لطلب معلومات الاتصال أثناء الاستفسارات.'
        }
      },
      preview: {
        title: 'مختبر معاينة الذكاء الاصطناعي',
        desc: 'اختبر إعداداتك الحالية في بيئة آمنة قبل الحفظ.',
        placeholder: 'اسأل المساعد شيئاً...',
        close: 'إغلاق المختبر'
      },
      saveAlert: 'تمت مزامنة هيكلية الذكاء الاصطناعي.'
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAiConfig(localAI);
      alert(t[lang].saveAlert);
    } finally {
      setIsSaving(false);
    }
  };

  const updateAIField = (field: string, value: string | boolean) => {
    setLocalAI(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <div className="flex items-center gap-3">
             <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
             <div className="h-1 w-1 rounded-full bg-white/20" />
             <p className="text-[10px] font-mono text-accent-violet/60 uppercase tracking-tighter">
                {t[lang].lastUpdated}: {new Date(localAI.lastUpdatedAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
             </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 w-full lg:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all duration-300"
          >
            <Play className="w-3 h-3 text-accent-violet" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].previewBtn}</span>
          </button>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-accent-violet hover:bg-accent-violet/80 text-white rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].updateBtn}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-4 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
        {[
          { id: 'personality', icon: MessageSquareText, label: t[lang].tabs.personality },
          { id: 'knowledge', icon: FileCode2, label: t[lang].tabs.knowledge },
          { id: 'controls', icon: SlidersHorizontal, label: t[lang].tabs.controls },
          { id: 'logs', icon: History, label: t[lang].tabs.logs }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'personality' | 'knowledge' | 'controls' | 'logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-8 min-h-[500px]">
        {activeTab === 'personality' && (
          <div className="space-y-10 max-w-4xl animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t[lang].personality.nameLabel}</label>
                  <input 
                    type="text" 
                    value={localAI.assistantName}
                    onChange={(e) => updateAIField('assistantName', e.target.value)}
                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-black tracking-widest text-white focus:outline-none focus:border-accent-violet/50 transition-all ${isRtl ? 'text-right' : ''}`}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t[lang].personality.toneLabel}</label>
                  <select 
                    value={localAI.tone}
                    onChange={(e) => updateAIField('tone', e.target.value)}
                    className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-all ${isRtl ? 'text-right' : ''}`}
                  >
                    {t[lang].personality.tones.map((tone, idx) => (
                      <option key={idx} value={tone}>{tone}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t[lang].personality.welcomeEnLabel}</label>
                  <textarea 
                    rows={4} 
                    value={localAI.welcomeMessageEn}
                    onChange={(e) => updateAIField('welcomeMessageEn', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono text-white/80 focus:outline-none focus:border-accent-violet/50 transition-all resize-none leading-relaxed"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t[lang].personality.welcomeArLabel}</label>
                  <textarea 
                    rows={4} 
                    value={localAI.welcomeMessageAr}
                    onChange={(e) => updateAIField('welcomeMessageAr', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono text-white/80 focus:outline-none focus:border-accent-violet/50 transition-all resize-none leading-relaxed text-right"
                  />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* System Prompt */}
                <div className="lg:col-span-5 space-y-4">
                   <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">{t[lang].knowledge.systemPromptLabel}</h3>
                      <p className="text-[10px] font-mono text-white/30 leading-relaxed uppercase">{t[lang].knowledge.systemPromptDesc}</p>
                   </div>
                   <textarea 
                     rows={15} 
                     value={localAI.systemPrompt}
                     onChange={(e) => updateAIField('systemPrompt', e.target.value)}
                     className={`w-full bg-black border border-white/10 rounded-xl p-5 text-[11px] font-mono text-white/70 focus:outline-none focus:border-accent-violet/50 transition-all custom-scrollbar leading-relaxed ${isRtl ? 'text-right' : ''}`}
                     placeholder="You are a cinematic AI assistant for Ahmed Helal..."
                   />
                </div>

                {/* Knowledge Base */}
                <div className="lg:col-span-7 space-y-4">
                   <div className="flex items-center justify-between">
                      <div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">{t[lang].knowledge.knowledgeBaseLabel}</h3>
                         <p className="text-[10px] font-mono text-white/30 leading-relaxed uppercase">{t[lang].knowledge.knowledgeBaseDesc}</p>
                      </div>
                      <span className="text-[9px] font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{t[lang].knowledge.supportMarkdown}</span>
                   </div>
                   <textarea 
                     rows={15} 
                     value={localAI.knowledgeBase}
                     onChange={(e) => updateAIField('knowledgeBase', e.target.value)}
                     className={`w-full bg-black border border-white/10 rounded-xl p-5 text-[11px] font-mono text-white/70 focus:outline-none focus:border-accent-violet/50 transition-all custom-scrollbar leading-relaxed ${isRtl ? 'text-right' : ''}`}
                     placeholder="# About Ahmed\nAhmed is a visual designer based in Egypt..."
                   />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].controls.title}</h2>
            
            <div className="space-y-6">
               <div className={`flex items-start justify-between bg-black/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group ${isRtl ? 'flex-row-reverse' : ''}`} onClick={() => updateAIField('autoSuggest', !localAI.autoSuggest)}>
                  <div className={isRtl ? 'text-right' : ''}>
                     <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1 group-hover:text-accent-violet transition-colors">{t[lang].controls.suggest.title}</h3>
                     <p className="text-[10px] font-mono text-white/40">{t[lang].controls.suggest.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${localAI.autoSuggest ? 'bg-accent-violet' : 'bg-white/10'}`}>
                     <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${localAI.autoSuggest ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                  </div>
               </div>

               <div className={`flex items-start justify-between bg-black/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group ${isRtl ? 'flex-row-reverse' : ''}`} onClick={() => updateAIField('leadCaptureEnforcement', !localAI.leadCaptureEnforcement)}>
                  <div className={isRtl ? 'text-right' : ''}>
                     <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1 group-hover:text-accent-violet transition-colors">{t[lang].controls.lead.title}</h3>
                     <p className="text-[10px] font-mono text-white/40">{t[lang].controls.lead.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${localAI.leadCaptureEnforcement ? 'bg-accent-violet' : 'bg-white/10'}`}>
                     <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${localAI.leadCaptureEnforcement ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <ConversationViewer />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <AiLabPreview 
            config={localAI} 
            onClose={() => setIsPreviewOpen(false)} 
            lang={lang} 
            t={t[lang].preview} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Lab Preview Component (Internal) ---
const AiLabPreview = ({ config, onClose, lang, t }: { config: AdminConfig['ai'], onClose: () => void, lang: 'en' | 'ar', t: Record<string, string> }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';

  useEffect(() => {
    // Initial welcome message based on preview config
    const welcomeText = lang === 'ar' ? config.welcomeMessageAr : config.welcomeMessageEn;
    setMessages([{ role: 'assistant', content: welcomeText }]);
  }, [config, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Mock / Real AI Call with local preview context
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      
      const prompt = `
SYSTEM_INSTRUCTION:
${config.systemPrompt}

KNOWLEDGE_BASE:
${config.knowledgeBase}

TONE: ${config.tone}

USER_MESSAGE: ${userMsg}

IMPORTANT: Respond in ${lang === 'ar' ? 'Arabic' : 'English'}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating response.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err: unknown) {
      console.error("Lab Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "[LAB_ERROR]: Could not connect to Gemini." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/80 backdrop-blur-md"
       />
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.95, y: 20 }}
         className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col h-[80vh] z-100"
       >
          {/* Lab Header */}
          <div className={`p-6 border-b border-white/5 bg-white/2 backdrop-blur-xl flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
             <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20">
                   <Sparkles className="w-5 h-5 text-accent-violet animate-pulse" />
                </div>
                <div>
                   <h2 className="text-sm font-black uppercase tracking-widest text-white">{t.title}</h2>
                   <p className="text-[10px] font-mono text-white/40 uppercase">{t.desc}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                <X className="w-5 h-5" />
             </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} ${isRtl ? (m.role === 'user' ? 'justify-start' : 'justify-end') : ''}`}>
                   <div className={`max-w-[85%] flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} ${isRtl ? (m.role === 'user' ? 'flex-row' : 'flex-row-reverse') : ''}`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-accent-violet/5 border-accent-violet/20'}`}>
                         {m.role === 'user' ? <User className="w-4 h-4 text-white/60" /> : <Bot className="w-4 h-4 text-accent-violet" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-white/5 text-white/80 rounded-tr-none' : 'bg-accent-violet/10 text-white rounded-tl-none'} ${isRtl ? 'text-right' : 'text-left'}`}>
                         {m.content}
                      </div>
                   </div>
                </div>
             ))}
             {loading && (
                <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
                   <div className="bg-accent-violet/5 border border-accent-violet/10 p-3 rounded-2xl flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-accent-violet animate-spin" />
                      <span className="text-[10px] font-mono text-accent-violet font-bold uppercase tracking-widest italic animate-pulse">Processing...</span>
                   </div>
                </div>
             )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/5 bg-black/50">
             <div className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-accent-violet/40 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-white ${isRtl ? 'text-right' : ''}`}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-accent-violet hover:bg-accent-violet/80 p-3 rounded-xl transition-all disabled:opacity-50"
                >
                   <Send className="w-4 h-4 text-white" />
                </button>
             </div>
          </div>
       </motion.div>
    </div>
  );
};
