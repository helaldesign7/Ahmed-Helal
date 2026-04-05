import { useState } from 'react';
import { Save, MessageSquareText, FileCode2, SlidersHorizontal, History } from 'lucide-react';
import { ConversationViewer } from '../components/ai/ConversationViewer';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';

export const AISettings = () => {
  const { config, setConfig } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeTab, setActiveTab] = useState<'personality' | 'knowledge' | 'controls' | 'logs'>('personality');
  const [localAI, setLocalAI] = useState(config.ai);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'AI Architecture',
      subtitle: "Configure your virtual assistant's brain",
      updateBtn: 'Update AI Model',
      tabs: {
        personality: 'Base Personality',
        knowledge: 'Knowledge Base',
        controls: 'Triggers',
        logs: 'Chat Logs'
      },
      personality: {
        title: 'Identity & Welcome',
        nameLabel: 'Assistant Name',
        welcomeLabel: 'Welcome Message (Initial Greeting)',
        toneLabel: 'Tone of Voice Guidelines',
        tones: [
          'Cinematic / Robotic (Jarvis style)',
          'Professional / Corporate',
          'Friendly / Casual',
          'Custom (Defined in Knowledge Base)'
        ]
      },
      knowledge: {
        title: 'System Prompt Overrides',
        supportMarkdown: 'Supports Markdown',
        desc: 'This is the raw system prompt injected into the LLM context. Tell it who you are, what services you offer, and how it should handle project inquiries or answer questions about your experience.'
      },
      controls: {
        title: 'Behavioral Adjustments',
        suggest: {
          title: 'Auto-Suggest Mode',
          desc: 'AI will proactively offer quick reply prompts above the chat box.'
        },
        lead: {
          title: 'Lead Capture Enforcement',
          desc: 'AI will ask for email before answering complex project questions.'
        }
      },
      saveAlert: 'AI Model Configuration Updated.'
    },
    ar: {
      title: 'هيكلية الذكاء الاصطناعي',
      subtitle: 'تكوين عقل مساعدك الافتراضي',
      updateBtn: 'تحديث نموذج الذكاء الاصطناعي',
      tabs: {
        personality: 'الشخصية الأساسية',
        knowledge: 'قاعدة المعرفة',
        controls: 'المشغلات',
        logs: 'سجلات الدردشة'
      },
      personality: {
        title: 'الهوية والترحيب',
        nameLabel: 'اسم المساعد',
        welcomeLabel: 'رسالة الترحيب (الافتتاحية)',
        toneLabel: 'إرشادات نبرة الصوت',
        tones: [
          'سينمائي / آلي (نمط جارفيس)',
          'مهني / رسمي',
          'ودي / غير رسمي',
          'مخصص (محدد في قاعدة المعرفة)'
        ]
      },
      knowledge: {
        title: 'تجاوزات المطالبة بالنظام (System Prompt)',
        supportMarkdown: 'يدعم لغة ماركداون',
        desc: 'هذا هو الموجه الأساسي للنظام المدمج في سياق النموذج اللغوي. أخبره بكيانك، وما هي الخدمات التي تقدمها، وكيف يجب أن يتعامل مع استفسارات المشاريع أو الإجابة على الأسئلة المتعلقة بخبرتك.'
      },
      controls: {
        title: 'التعديلات السلوكية',
        suggest: {
          title: 'وضع الاقتراح التلقائي',
          desc: 'سيقدم الذكاء الاصطناعي استجابات سريعة مقترحة فوق مربع الدردشة.'
        },
        lead: {
          title: 'فرض جمع بيانات العملاء',
          desc: 'سيطلب الذكاء الاصطناعي البريد الإلكتروني قبل الإجابة على أسئلة المشاريع المعقدة.'
        }
      },
      saveAlert: 'تم تحديث تكوين نموذج الذكاء الاصطناعي بنجاح.'
    }
  };

  const handleSave = () => {
    setConfig(prev => ({
      ...prev,
      ai: localAI
    }));
    alert(t[lang].saveAlert);
  };

  const updateAIField = (field: string, value: string | boolean) => {
    setLocalAI(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/80 text-white rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <Save className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">{t[lang].updateBtn}</span>
        </button>
      </div>

      <div className={`flex gap-4 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('personality')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'personality' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.personality}</span>
        </button>
        <button 
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'knowledge' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <FileCode2 className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.knowledge}</span>
        </button>
        <button 
          onClick={() => setActiveTab('controls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'controls' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.controls}</span>
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.logs}</span>
        </button>
      </div>

      {activeTab === 'logs' ? (
         <div className="animate-in fade-in slide-in-from-bottom-2">
            <ConversationViewer />
         </div>
      ) : (
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2">
          {activeTab === 'personality' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].personality.title}</h2>
              
              <div className="space-y-4">
                 <div>
                   <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].personality.nameLabel}</label>
                   <input 
                     type="text" 
                     value={localAI.assistantName}
                     onChange={(e) => updateAIField('assistantName', e.target.value)}
                     className={`w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-black tracking-widest text-white focus:outline-none focus:border-accent-violet/50 transition-colors mt-2 ${isRtl ? 'text-right' : ''}`}
                   />
                 </div>

                 <div>
                   <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].personality.welcomeLabel}</label>
                   <textarea 
                     rows={3} 
                     value={localAI.welcomeMessage}
                     onChange={(e) => updateAIField('welcomeMessage', e.target.value)}
                     className={`w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-accent-violet/50 transition-colors mt-2 resize-none ${isRtl ? 'text-right' : ''}`}
                   />
                 </div>

                 <div>
                   <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].personality.toneLabel}</label>
                   <select 
                     value={localAI.tone}
                     onChange={(e) => updateAIField('tone', e.target.value)}
                     className={`w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors mt-2 ${isRtl ? 'text-right' : ''}`}
                   >
                     {t[lang].personality.tones.map((tone, idx) => (
                       <option key={idx} value={tone}>{tone}</option>
                     ))}
                   </select>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
                <div className={`flex items-center justify-between border-b border-white/5 pb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <h2 className="text-sm font-black uppercase tracking-widest text-white">{t[lang].knowledge.title}</h2>
                   <span className="text-[9px] font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{t[lang].knowledge.supportMarkdown}</span>
                </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase tracking-wider">
                  {t[lang].knowledge.desc}
                </p>
                <textarea 
                  rows={14} 
                  value={localAI.systemPrompt}
                  onChange={(e) => updateAIField('systemPrompt', e.target.value)}
                  className={`w-full bg-black border border-white/10 rounded-lg p-4 text-xs font-mono text-white/80 focus:outline-none focus:border-accent-violet/80 transition-colors custom-scrollbar ${isRtl ? 'text-right' : ''}`}
                />
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].controls.title}</h2>
              
              <div className="space-y-6">
                 <div className={`flex items-start justify-between bg-black/50 border border-white/5 p-4 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={isRtl ? 'text-right' : ''}>
                       <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">{t[lang].controls.suggest.title}</h3>
                       <p className="text-[10px] font-mono text-white/40">{t[lang].controls.suggest.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={localAI.autoSuggest}
                      onChange={(e) => updateAIField('autoSuggest', e.target.checked)}
                      className="accent-accent-violet w-4 h-4 cursor-pointer mt-1" 
                    />
                 </div>

                 <div className={`flex items-start justify-between bg-black/50 border border-white/5 p-4 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={isRtl ? 'text-right' : ''}>
                       <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">{t[lang].controls.lead.title}</h3>
                       <p className="text-[10px] font-mono text-white/40">{t[lang].controls.lead.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={localAI.leadCaptureEnforcement}
                      onChange={(e) => updateAIField('leadCaptureEnforcement', e.target.checked)}
                      className="accent-accent-violet w-4 h-4 cursor-pointer mt-1" 
                    />
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
