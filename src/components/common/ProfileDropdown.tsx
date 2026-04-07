import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Briefcase, MessageSquare, Plus, ChevronRight, Rocket, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/useAdmin';
import { useState, useMemo } from 'react';

interface ProfileDropdownProps {
  lang: 'en' | 'ar';
}

export const ProfileDropdown = ({ lang }: ProfileDropdownProps) => {
  const { user, logout } = useAuth();
  const { leads } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = lang === 'ar';

  const t = {
    en: {
      activity: 'Your Activity',
      requests: 'My Requests',
      chats: 'Recent Chats',
      newRequest: 'New Request',
      startFirst: 'Start Your First Project',
      expiry: 'Auto-clear: 30d',
      historyExpiry: 'Chat history auto-deleted after 30 days',
      noHistory: 'No previous interactions found',
      signOut: 'Sign Out System',
      identity: 'Identity Verified'
    },
    ar: {
      activity: 'نشاطك الأخير',
      requests: 'طلباتي',
      chats: 'محادثات حديثة',
      newRequest: 'طلب جديد',
      startFirst: 'ابدأ مشروعك الأول الآن',
      expiry: 'مسح تلقائي: ٣٠ يوم',
      historyExpiry: 'يتم حذف سجل الدردشة تلقائياً بعد ٣٠ يوماً',
      noHistory: 'لا توجد محادثات سابقة حالياً',
      signOut: 'تسجيل الخروج من النظام',
      identity: 'الهوية مفعلة'
    }
  };

  const userProjects = useMemo(() => {
    if (!user?.email) return [];
    return leads.filter(lead => lead.email?.toLowerCase() === user.email.toLowerCase());
  }, [leads, user]);

  const recentChats = useMemo(() => {
    const saved = localStorage.getItem(`portfolio_chat_${user?.id || 'guest'}`);
    if (saved) {
      try {
        const messages = JSON.parse(saved);
        return messages.slice(-2).reverse();
      } catch {
        return [];
      }
    }
    return [];
  }, [user]);

  const handleStartProject = () => {
    setIsOpen(false);
    const el = document.getElementById('start-project');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#start-project';
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${isRtl ? 'font-arabic' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group relative shadow-xl"
      >
        <User className="w-5 h-5 text-white/50 group-hover:text-accent-violet" />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-3 border-primary-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute mt-4 w-80 bg-[#0B0B0B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden ${isRtl ? 'left-0' : 'right-0'}`}
            >
              {/* Header */}
              <div className={`p-7 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent ${isRtl ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-violet to-accent-violet/40 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-accent-violet/20">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white font-black truncate text-sm uppercase tracking-tight">{user.name}</h4>
                    <p className="text-white/30 text-[9px] font-mono uppercase tracking-[0.2em] truncate mt-1">{user.email}</p>
                    <div className={`flex items-center gap-1.5 mt-2 opacity-50`}>
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">{t[lang].identity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className={`py-4 px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ${isRtl ? 'text-right' : ''}`}>
                  {t[lang].activity}
                </div>

                <div className="space-y-2">
                  <div className="group/item">
                    <div className={`flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/item:text-white transition-colors cursor-default`}>
                      <div className={`flex items-center gap-3`}>
                        <Briefcase className="w-4 h-4 text-accent-violet opacity-50" />
                        <span>{t[lang].requests}</span>
                      </div>
                      <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[10px] font-mono border border-white/10">{userProjects.length}</span>
                    </div>

                    {userProjects.length > 0 ? (
                      <div className="px-3 pb-3 space-y-2">
                        {userProjects.slice(0, 2).map((project, i) => (
                          <div key={i} className={`p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-violet/30 transition-all ${isRtl ? 'text-right' : ''}`}>
                            <div className="font-black text-white text-[11px] leading-tight uppercase tracking-tight">{project.serviceType}</div>
                            <div className={`flex justify-between items-center mt-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[9px] text-accent-violet uppercase font-mono font-bold">{project.status}</span>
                              <ChevronRight className={`w-3.5 h-3.5 text-white/10 ${isRtl ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleStartProject}
                          className="w-full py-4 bg-accent-violet text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-accent-violet/80 shadow-lg shadow-accent-violet/10"
                        >
                          <Plus className="w-4 h-4" /> {t[lang].newRequest}
                        </button>
                      </div>
                    ) : (
                      <div className="px-3 pb-3">
                        <button
                          onClick={handleStartProject}
                          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group"
                        >
                          <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform text-accent-violet" />
                          {t[lang].startFirst}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="group/item">
                    <div className={`flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/item:text-white transition-colors cursor-default`}>
                      <div className={`flex items-center gap-3`}>
                        <MessageSquare className="w-4 h-4 text-accent-violet opacity-50" />
                        <span>{t[lang].chats}</span>
                      </div>
                      <span className="text-[8px] font-mono text-white/20 bg-white/5 px-2 py-1 rounded border border-white/5">
                        {t[lang].expiry}
                      </span>
                    </div>
                    {recentChats.length > 0 ? (
                      <div className="px-3 pb-3 space-y-2">
                        {recentChats.map((chat: { text: string }, i: number) => (
                          <div key={i} className={`p-4 bg-primary-black rounded-2xl border border-white/5 truncate italic text-[10px] text-white/30 font-mono tracking-tight ${isRtl ? 'text-right' : ''}`}>
                            "{chat.text}"
                          </div>
                        ))}
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/10 text-center pt-2">
                          {t[lang].historyExpiry}
                        </p>
                      </div>
                    ) : (
                      <div className="px-6 py-6 text-[10px] text-white/10 italic text-center font-mono uppercase tracking-widest">
                        {t[lang].noHistory}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2 p-3 border-t border-white/5 bg-black/40">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-5 text-[10px] text-red-400 hover:bg-red-400/5 rounded-3xl transition-all font-black uppercase tracking-[0.2em]`}
                >
                  <LogOut className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  <span>{t[lang].signOut}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
