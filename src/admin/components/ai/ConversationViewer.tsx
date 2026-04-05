import { useState } from 'react';
import { Search, MapPin, Clock, UserCircle, Bot, AlertTriangle, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const mockConversations = [
  { id: 'CONV-901', user: 'Guest_A92F', messages: 14, date: '10:42 AM', hasLead: false, status: 'active' },
  { id: 'CONV-902', user: 'Sarah J.', messages: 32, date: 'Yesterday', hasLead: true, status: 'converted' },
  { id: 'CONV-903', user: 'Guest_B441', messages: 2, date: 'Oct 12', hasLead: false, status: 'abandoned' },
];

const mockTranscript = [
  { role: 'assistant', text: "SYSTEM ONLINE. I am the digital assistant assigned to Ahmed's portfolio. How may I route your inquiry today?", time: '10:42 AM' },
  { role: 'user', text: 'Hi, I need a website for my 3D design studio.', time: '10:43 AM' },
  { role: 'assistant', text: 'Excellent. Ahmed specializes in immersive 3D web experiences using React Three Fiber. Could you briefly describe the scale of the project?', time: '10:43 AM' },
  { role: 'user', text: 'Just a portfolio. 4 pages. Needs to look premium.', time: '10:44 AM' },
];

export const ConversationViewer = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeSession, setActiveSession] = useState(mockConversations[0].id);
  const isRtl = lang === 'ar';

  const t = {
    en: {
      search: 'Search conversations...',
      msgs: 'msgs',
      leadLabel: 'Lead',
      tracking: 'Session Tracking',
      duration: '4 mins duration',
      location: 'EG, Cairo',
      viewProfile: 'View Lead Profile',
      flag: 'Flag Session',
      assistant: 'Aura Assistant',
      user: 'User Identity'
    },
    ar: {
      search: 'البحث في المحادثات...',
      msgs: 'رسائل',
      leadLabel: 'عميل محتمل',
      tracking: 'تتبع الجلسة',
      duration: 'مدة الجلسة ٤ دقائق',
      location: 'مصر، القاهرة',
      viewProfile: 'عرض ملف العميل',
      flag: 'تحديد الجلسة',
      assistant: 'المساعد الذكي أورا',
      user: 'هوية المستخدم'
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-0 h-[650px] bg-primary-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl ${isRtl ? 'text-right' : ''}`}>
      
      {/* Sidebar: Conversation List */}
      <div className={`border-accent-violet/5 flex flex-col bg-black/40 ${isRtl ? 'order-2 border-l' : 'order-1 border-r'}`}>
        <div className="p-6 border-b border-white/5 bg-white/2">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t[lang].search}
              className={`w-full bg-black/50 border border-white/10 rounded-xl py-3 text-xs text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
            />
            <Search className={`w-3.5 h-3.5 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'}`} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {mockConversations.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setActiveSession(conv.id)}
              className={`p-6 border-b border-white/5 cursor-pointer transition-all ${
                activeSession === conv.id 
                  ? 'bg-accent-violet/10 ring-1 ring-inset ring-accent-violet/20' 
                  : 'hover:bg-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              <div className={`flex justify-between items-start mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-black text-white uppercase tracking-tight">{conv.user}</span>
                <span className="text-[9px] font-mono text-white/30">{conv.date}</span>
              </div>
              <div className={`flex items-center gap-3 mt-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`text-[9px] font-mono text-white/40 uppercase flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <MessageSquare className="w-3.5 h-3.5 opacity-50" /> {conv.messages} {t[lang].msgs}
                </span>
                {conv.hasLead && (
                   <span className="bg-green-500/10 text-green-400 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-green-500/20">
                     {t[lang].leadLabel}
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main View: Transcript */}
      <div className={`lg:col-span-2 flex flex-col bg-primary-black ${isRtl ? 'order-1' : 'order-2'}`}>
        {/* Header */}
        <div className={`h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/60 shadow-lg z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
           <div className={isRtl ? 'text-right' : ''}>
             <h3 className={`text-sm font-black text-white uppercase tracking-tight flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {t[lang].tracking} 
                {isRtl ? <ChevronLeft className="w-4 h-4 text-white/20" /> : <ChevronRight className="w-4 h-4 text-white/20" />}
                <span className="text-accent-violet font-mono">{activeSession}</span>
             </h3>
             <div className={`flex items-center gap-6 mt-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
               <span className={`text-[10px] font-mono text-white/30 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><MapPin className="w-3.5 h-3.5 opacity-40" /> {t[lang].location}</span>
               <span className={`text-[10px] font-mono text-white/30 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><Clock className="w-3.5 h-3.5 opacity-40" /> {t[lang].duration}</span>
             </div>
           </div>
           
           <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
             {mockConversations.find(c => c.id === activeSession)?.hasLead ? (
               <button className={`text-[9px] font-black uppercase tracking-widest bg-green-500 text-black px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-green-400 transition-all shadow-lg shadow-green-500/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <UserCircle className="w-3.5 h-3.5" /> {t[lang].viewProfile}
               </button>
             ) : (
               <button className={`text-[9px] font-black uppercase tracking-widest hover:bg-white/5 text-white/40 hover:text-white border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <AlertTriangle className="w-3.5 h-3.5" /> {t[lang].flag}
               </button>
             )}
           </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-linear-to-b from-white/2 to-transparent">
          {mockTranscript.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center shrink-0 shadow-lg shadow-accent-violet/5">
                  <Bot className="w-5 h-5 text-accent-violet" />
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-3xl p-6 shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-accent-violet/10 text-white rounded-tr-md border border-accent-violet/20' 
                  : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-md'
              }`}>
                <div className={`text-sm leading-relaxed font-mono whitespace-pre-wrap ${isRtl ? 'text-right' : ''}`}>{msg.text}</div>
                <div className={`text-[8px] font-mono uppercase tracking-[0.2em] mt-4 opacity-30 ${msg.role === 'user' ? (isRtl ? 'text-left' : 'text-right') : (isRtl ? 'text-right' : 'text-left')}`}>
                  {msg.time}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <UserCircle className="w-5 h-5 text-white/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
