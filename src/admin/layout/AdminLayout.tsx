import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Home, HardDrive, Bell, Globe } from 'lucide-react';
import { useState } from 'react';
import { MediaManagerModal } from '../components/media/MediaManagerModal';
import { useAdmin } from '../../contexts/useAdmin';

export const AdminLayout = () => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications,
    hasUnsavedChanges,
    saveStatus,
    saveWebsiteChanges,
    resetWebsiteChanges
  } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<'en' | 'ar'>(() => (localStorage.getItem('language') as 'en' | 'ar') || 'en');
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const t = {
    en: {
      viewSite: 'Portfolio View',
      notifications: 'Notifications',
      pending: 'pending',
      clear: 'All systems clear',
      markRead: 'Mark all as read',
      media: 'Media',
      status: 'System OK',
      switchLang: 'العربية',
      unsaved: 'Unsaved Changes Found',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Save Failed',
      reset: 'Discard'
    },
    ar: {
      viewSite: 'عرض الموقع',
      notifications: 'التنبيهات',
      pending: 'تنبيهات',
      clear: 'لا توجد تنبيهات جديدة',
      markRead: 'تحديد الكل كمقروء',
      media: 'الوسائط',
      status: 'النظام متاح',
      switchLang: 'English',
      unsaved: 'يوجد تغييرات غير محفوظة',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      saved: 'تم الحفظ',
      error: 'فشل الحفظ',
      reset: 'إلغاء'
    }
  };

  const handleNotificationClick = (id: string, link: string) => {
    markNotificationAsRead(id);
    navigate(link);
  };

  const isRtl = lang === 'ar';

  return (
    <div className={`flex h-screen bg-primary-black text-white font-sans overflow-hidden ${isRtl ? 'rtl font-arabic' : 'ltr'}`}>
      <Sidebar lang={lang} />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className={`h-22 bg-[#080808]/40 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-30 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className={`flex items-center gap-3 text-white/40 hover:text-white transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] mx-1 opacity-20">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t[lang].viewSite}</span>
          </Link>
          
          <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
             
             {/* Language Switcher */}
             <button 
                onClick={() => {
                  const nl = lang === 'en' ? 'ar' : 'en';
                  setLang(nl);
                  localStorage.setItem('language', nl);
                  window.dispatchEvent(new Event('storage'));
                }}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent-violet/30 transition-all shadow-lg ${isRtl ? 'flex-row-reverse' : ''}`}
             >
                <Globe className="w-3.5 h-3.5 text-accent-violet opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t[lang].switchLang}</span>
             </button>

             {/* Notification Center */}
             <div className="relative group">
                <button className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group shadow-xl">
                  <Bell className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent-violet rounded-full border-2 border-[#080808] animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                  )}
                </button>
                
                {/* Dropdown Panel */}
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-4 w-96 bg-[#0B0B0B] border border-white/10 rounded-4xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-50 overflow-hidden`}>
                  <div className={`p-6 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{t[lang].notifications}</h3>
                    <span className="text-[9px] font-mono text-accent-violet bg-accent-violet/10 px-2.5 py-1 rounded-lg border border-accent-violet/20">{unreadCount} {t[lang].pending}</span>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n.id, n.link)}
                          className={`p-6 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative group/item ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-accent-violet shrink-0 mt-1.5 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />}
                            <div className={n.read ? 'opacity-30' : ''}>
                              <p className="text-xs font-black text-white mb-1.5 uppercase tracking-wide">{n.title}</p>
                              <p className="text-[10px] font-mono text-white/50 leading-relaxed uppercase opacity-80">{n.description}</p>
                              <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] mt-3">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-[10px] font-mono text-white/10 uppercase tracking-[0.3em] italic">
                        {t[lang].clear}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 text-center border-t border-white/5 bg-black/40">
                    <button 
                      onClick={clearNotifications}
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-accent-violet transition-colors py-2"
                    >
                      {t[lang].markRead}
                    </button>
                  </div>
                </div>
             </div>

             <div className="h-8 w-px bg-white/5 mx-1" />

             <button 
                onClick={() => setShowMediaManager(true)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-lg ${isRtl ? 'flex-row-reverse' : ''}`}
             >
                <HardDrive className="w-4 h-4 text-accent-violet opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{t[lang].media}</span>
             </button>

             <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black border border-white/5 shadow-inner ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{t[lang].status}</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-10 relative">
          <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in duration-700 pb-32">
            <Outlet context={{ lang }} />
          </div>
          {/* Subtle Background Glow for main content */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-accent-violet/5 to-transparent pointer-events-none -z-1" />
        </main>

        {/* Global Save/Draft Bar */}
        {(!location.pathname.includes('/admin/crm') && !location.pathname.includes('/admin/leads') && !location.pathname.includes('/admin/workspace') && !location.pathname.includes('/admin/logs')) && (hasUnsavedChanges || saveStatus !== 'idle') && (
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-2xl bg-[#0F0F0F]/80 backdrop-blur-3xl border border-white/10 rounded-full p-2.5 shadow-[0_30px_100px_rgba(0,0,0,1)] flex items-center justify-between transition-all duration-500 animate-in slide-in-from-bottom-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <div className={`flex items-center gap-4 px-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-accent-violet animate-pulse shadow-[0_0_12px_rgba(139,92,246,1)]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-white/80">{t[lang].unsaved}</span>
             </div>

             <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <button 
                  onClick={resetWebsiteChanges}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2.5 rounded-full hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all disabled:opacity-30"
                >
                  {t[lang].reset}
                </button>
                
                <button 
                  onClick={saveWebsiteChanges}
                  disabled={saveStatus === 'saving'}
                  className={`px-10 py-3.5 rounded-full bg-accent-violet hover:bg-accent-violet/80 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {t[lang].saving}
                    </>
                  ) : saveStatus === 'saved' ? (
                    t[lang].saved
                  ) : saveStatus === 'error' ? (
                    t[lang].error
                  ) : (
                    t[lang].save
                  )}
                </button>
             </div>
          </div>
        )}
      </div>
      
      {showMediaManager && <MediaManagerModal lang={lang} onClose={() => setShowMediaManager(false)} />}
    </div>
  );
};
