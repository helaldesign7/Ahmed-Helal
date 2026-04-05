import { Search, Plus, MoreHorizontal, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export const CrmTicketsTab = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const isRtl = lang === 'ar';

  const t = {
    en: {
      searchPlaceholder: 'Search tickets or support IDs...',
      newTicket: 'Initialize Ticket',
      id: 'Ticket ID',
      status: 'Current Status',
      priority: 'Urgency Level',
      subject: 'Subject Matrix',
      lastUpdate: 'Temporal Echo',
      statuses: {
        open: 'In Buffer',
        closed: 'Resolved',
        pending: 'Holding'
      },
      priorityLevels: {
        critical: 'Critical',
        medium: 'Medium',
        stable: 'Stable'
      },
      footer: 'Communication lines encrypted through Matrix bridge protocol'
    },
    ar: {
      searchPlaceholder: 'ابحث في التذاكر أو معرفات الدعم...',
      newTicket: 'فتح تذكرة جديدة',
      id: 'معرف التذكرة',
      status: 'الحالة الحالية',
      priority: 'مستوى الأهمية',
      subject: 'موضوع الطلب',
      lastUpdate: 'آخر نشاط',
      statuses: {
        open: 'قيد الانتظار',
        closed: 'تم الحل',
        pending: 'في القائمة'
      },
      priorityLevels: {
        critical: 'حرج',
        medium: 'متوسط',
        stable: 'مستقر'
      },
      footer: 'خطوط الاتصال مشفرة عبر بروتوكول جسر المصفوفة'
    }
  };

  const [search, setSearch] = useState('');

  // Mock data for UI
  const tickets = [
    { id: 'TIC-102', subject: 'Project Asset Error: Hero Video not loading on Safari', status: 'open', priority: 'critical', lastUpdate: '2 mins ago', from: 'Sarah Jenkins' },
    { id: 'TIC-098', subject: 'Inquiry: API connectivity for digital agencies', status: 'pending', priority: 'medium', lastUpdate: '1 hr ago', from: 'Mark Davis' },
    { id: 'TIC-054', subject: 'Feedback: Design aesthetics and color balancing', status: 'closed', priority: 'stable', lastUpdate: 'Yesterday', from: 'Legacy User' },
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
          <button className={`flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Plus className="w-3.5 h-3.5" />
            {t[lang].newTicket}
          </button>
       </div>

       {/* Tickets List */}
       <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/60">
              <thead className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-black/40">
                <tr className={isRtl ? 'flex-row-reverse items-center' : ''}>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].id}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].subject}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].status}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].priority}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].lastUpdate}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-left' : 'text-right'}`}></th>
                </tr>
              </thead>
              <tbody>
                 {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className={`px-6 py-5 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 font-black text-white text-[10px] uppercase tracking-widest">
                          <MessageSquare className="w-3 h-3 text-accent-violet opacity-60" />
                          {ticket.id}
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                         <div className="text-white/80 font-bold text-xs">{ticket.subject}</div>
                         <div className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-widest">From: {ticket.from}</div>
                      </td>
                      <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                         {ticket.status === 'open' && (
                           <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-black uppercase tracking-wider flex items-center w-fit gap-1.5">
                             <Clock className="w-2.5 h-2.5" /> {t[lang].statuses.open}
                           </span>
                         )}
                         {ticket.status === 'pending' && (
                           <span className="px-2 py-0.5 bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20 rounded text-[9px] font-black uppercase tracking-wider flex items-center w-fit gap-1.5">
                             <AlertCircle className="w-2.5 h-2.5" /> {t[lang].statuses.pending}
                           </span>
                         )}
                         {ticket.status === 'closed' && (
                           <span className="px-2 py-0.5 bg-white/5 text-white/30 border border-white/10 rounded text-[9px] font-black uppercase tracking-wider flex items-center w-fit gap-1.5">
                             <CheckCircle className="w-2.5 h-2.5" /> {t[lang].statuses.closed}
                           </span>
                         )}
                      </td>
                      <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                         <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${
                           ticket.priority === 'critical' ? 'text-red-400 font-black' : 'text-white/40'
                         }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${
                             ticket.priority === 'critical' ? 'bg-red-400' : 
                             ticket.priority === 'medium' ? 'bg-accent-yellow' : 'bg-white/20'
                           }`} />
                           {/* @ts-ignore */}
                           {t[lang].priorityLevels[ticket.priority]}
                         </div>
                      </td>
                      <td className={`px-6 py-4 text-[10px] font-mono opacity-80 ${isRtl ? 'text-right' : 'text-left'}`}>{ticket.lastUpdate}</td>
                      <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                         <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-colors">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
       </div>

       <p className="text-[9px] font-mono text-white/20 text-center uppercase tracking-[0.2em] py-4">{t[lang].footer}</p>
    </div>
  );
};
