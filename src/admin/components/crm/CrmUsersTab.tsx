import { Search, UserCheck, Shield, Globe, MoreHorizontal, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export const CrmUsersTab = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const isRtl = lang === 'ar';

  const t = {
    en: {
      searchPlaceholder: 'Search session identities...',
      activeStatus: 'Active Session',
      identity: 'Device Identity',
      role: 'System Role',
      visits: 'Total Interactions',
      lastSeen: 'Matrix Pulse',
      roleType: 'Guest Entity',
      browser: 'Browser Interface',
      location: 'Route Point',
      footer: 'Real-time user heartbeat monitored through secure bridge'
    },
    ar: {
      searchPlaceholder: 'ابحث في هويات جلسات العمل...',
      activeStatus: 'جلسة نشطة',
      identity: 'هوية الجهاز',
      role: 'دور النظام',
      visits: 'إجمالي التفاعلات',
      lastSeen: 'نبض المصفوفة',
      roleType: 'كيان زائر',
      browser: 'واجهة المتصفح',
      location: 'نقطة المسار',
      footer: 'يتم مراقبة نبضات المستخدم في الوقت الفعلي عبر الجسر الآمن'
    }
  };

  const [search, setSearch] = useState('');

  // Mock data for UI
  const users = [
    { id: 'USR-821', ip: '192.168.1.45', browser: 'Chrome / MacOS', role: 'Guest', visits: 12, lastSeen: '2 min ago', location: 'Cairo, EG' },
    { id: 'USR-342', ip: '104.22.1.8', browser: 'Safari / iPhone', role: 'Guest', visits: 4, lastSeen: '1 hr ago', location: 'Dubai, AE' },
    { id: 'USR-902', ip: '82.11.43.21', browser: 'Firefox / Windows', role: 'Guest', visits: 42, lastSeen: 'Today', location: 'Riyadh, SA' },
  ];

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : ''}`}>
       {/* Toolbar */}
       <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/20 p-4 border border-white/5 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder={t[lang].searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-black/50 border border-white/10 rounded-lg py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
            />
            <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          </div>
          <div className={`flex items-center gap-2 text-[10px] font-mono text-white/40 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <UserCheck className="w-3 h-3 text-green-400" />
            {users.length} {t[lang].activeStatus}
          </div>
       </div>

       {/* Users Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-[#0C0C0C] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group">
              <div className={`flex items-start justify-between mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">{user.id}</div>
                    <div className="text-[9px] font-mono text-white/30 uppercase mt-0.5">{user.ip}</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t[lang].role}</span>
                   <span className="px-2 py-0.5 bg-accent-violet/10 text-accent-violet border border-accent-violet/20 rounded text-[9px] font-black uppercase">{t[lang].roleType}</span>
                </div>
                <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t[lang].visits}</span>
                   <span className="text-xs font-mono text-white/80">{user.visits}</span>
                </div>
                <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t[lang].lastSeen}</span>
                   <span className="text-[10px] font-mono text-white/60">{user.lastSeen}</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className={isRtl ? 'text-right' : ''}>
                    <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1">{t[lang].browser}</label>
                    <div className="text-[10px] text-white/60 truncate">{user.browser}</div>
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1">{t[lang].location}</label>
                    <div className={`text-[10px] text-white/60 flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Globe className="w-2.5 h-2.5 opacity-40" />
                      {user.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className={`flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <Mail className="w-3 h-3" /> Message
                </button>
                <button className={`flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <ExternalLink className="w-3 h-3" /> Logs
                </button>
              </div>
            </div>
          ))}
       </div>

       <p className="text-[9px] font-mono text-white/20 text-center uppercase tracking-[0.2em] py-4">{t[lang].footer}</p>
    </div>
  );
};
