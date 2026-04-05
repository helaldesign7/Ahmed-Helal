import { Search, MoreVertical, CheckCircle, Eye, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { CrmUsersTab } from '../components/crm/CrmUsersTab';
import { CrmTicketsTab } from '../components/crm/CrmTicketsTab';
import { LeadDetailsModal } from '../components/crm/LeadDetailsModal';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';
import type { Lead } from '../../types/admin';

export const CRMLeads = () => {
  const { leads, setLeads } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeTab, setActiveTab] = useState<'leads' | 'users' | 'tickets'>('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'CRM & Leads',
      subtitle: 'Project Requests & Sales Pipeline',
      tabs: {
        leads: 'Leads',
        users: 'Users',
        tickets: 'Tickets'
      },
      searchPlaceholder: 'Search names, companies, or IDs...',
      statuses: {
        all: 'All Statuses',
        new: 'New Request',
        contacted: 'Contacted',
        in_progress: 'In Progress',
        completed: 'Won / Closed',
        lost: 'Lost'
      },
      table: {
        info: 'Lead Info',
        interest: 'Interest',
        pipeline: 'Pipeline Stage',
        activity: 'Activity',
        actions: 'Actions'
      },
      empty: 'No matching lead records found in the matrix',
      deleteConfirm: 'Are you sure you want to delete this lead? This action cannot be undone.',
      tooltips: {
        view: 'View Details',
        won: 'Mark Won',
        delete: 'Delete Lead',
        options: 'Options'
      },
      private: 'Private Entity'
    },
    ar: {
      title: 'إدارة العملاء وطلبات المشاريع',
      subtitle: 'طلبات المشاريع ومراحل التنفيذ',
      tabs: {
        leads: 'الطلبات',
        users: 'المستخدمين',
        tickets: 'التذاكر'
      },
      searchPlaceholder: 'ابحث بالاسم، الشركة أو المعرف...',
      statuses: {
        all: 'كل الحالات',
        new: 'طلب جديد',
        contacted: 'تم التواصل',
        in_progress: 'قيد التنفيذ',
        completed: 'تم الربح / الإغلاق',
        lost: 'خسارة المشروع'
      },
      table: {
        info: 'بيانات العميل',
        interest: 'الاهتمام',
        pipeline: 'مرحلة التنفيذ',
        activity: 'النشاط',
        actions: 'إجراءات'
      },
      empty: 'لم يتم العثور على سجلات مطابقة في قاعدة البيانات',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.',
      tooltips: {
        view: 'عرض التفاصيل',
        won: 'تحديد كمكتمل',
        delete: 'حذف العميل',
        options: 'خيارات'
      },
      private: 'جهة خاصة'
    }
  };

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead: Lead) => {
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a: Lead, b: Lead) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads, searchQuery, statusFilter]);

  const updateLeadStatus = (id: number, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    ));
  };

  const deleteLead = (id: number) => {
    if (confirm(t[lang].deleteConfirm)) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
  };

  return (
    <div className={`space-y-8 pb-10 relative ${isRtl ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className={`flex bg-[#0c0c0c] p-1 rounded-xl border border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
           {(['leads', 'users', 'tickets'] as const).map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
             >
               {t[lang].tabs[tab]}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'leads' && (
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2">
          {/* Toolbar */}
          <div className={`p-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/20 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <div className="relative w-full max-w-sm">
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={t[lang].searchPlaceholder}
                 className={`w-full bg-black/50 border border-white/10 rounded-lg py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
               />
               <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
             </div>

             <div className="flex gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-accent-violet/50 ${isRtl ? 'text-right' : ''}`}
                >
                  {Object.entries(t[lang].statuses).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
             </div>
          </div>

          {/* Kanban / List Hybrid View */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/60">
              <thead className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-black/40">
                <tr className={isRtl ? 'flex-row-reverse' : ''}>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : ''}`}>{t[lang].table.info}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : ''}`}>{t[lang].table.interest}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : ''}`}>{t[lang].table.pipeline}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : ''}`}>{t[lang].table.activity}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-left' : 'text-right'}`}>{t[lang].table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className={`px-6 py-5 ${isRtl ? 'text-right' : ''}`}>
                      <div className="font-bold text-white text-sm tracking-wide">{lead.name}</div>
                      {lead.projectTitle && (
                        <div className="text-[10px] text-white/40 mt-0.5 truncate max-w-[200px] italic">
                          "{lead.projectTitle}"
                        </div>
                      )}
                      <div className={`flex items-center gap-2 mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[9px] font-mono text-accent-violet uppercase">LD_{lead.id}</span>
                        <span className="text-[9px] font-mono text-white/40 uppercase">| {lead.company || t[lang].private}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${isRtl ? 'text-right' : ''}`}>
                      <div className="text-xs font-mono opacity-80">{lead.interest}</div>
                      {lead.budget && (
                        <div className="text-[10px] text-accent-violet font-bold mt-0.5">{lead.budget}</div>
                      )}
                    </td>
                    <td className={`px-6 py-4 ${isRtl ? 'text-right' : ''} relative`}>
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className={`bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white focus:outline-none focus:border-accent-violet appearance-none cursor-pointer ${isRtl ? 'pl-8 pr-3' : 'pr-8 pl-3'}`}
                      >
                        <option value="new">🆕 {t[lang].statuses.new}</option>
                        <option value="contacted">⏳ {t[lang].statuses.contacted}</option>
                        <option value="in_progress">⚡ {t[lang].statuses.in_progress}</option>
                        <option value="completed">✅ {t[lang].statuses.completed}</option>
                        <option value="lost">❌ {t[lang].statuses.lost}</option>
                      </select>
                    </td>
                    <td className={`px-6 py-4 text-xs font-mono ${isRtl ? 'text-right' : ''}`}>{lead.date}</td>
                    <td className={`px-6 py-4 text-right`}>
                      <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? 'justify-start' : 'justify-end'}`}>
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white border border-white/5" 
                          title={t[lang].tooltips.view}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateLeadStatus(lead.id, 'completed')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-green-400" 
                          title={t[lang].tooltips.won}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteLead(lead.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-red-500" 
                          title={t[lang].tooltips.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white" title={t[lang].tooltips.options}>
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-white/20 font-mono text-xs uppercase tracking-widest">
                      {t[lang].empty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <CrmUsersTab />
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <CrmTicketsTab />
        </div>
      )}

      {selectedLead && (
         <LeadDetailsModal 
           lead={selectedLead}
           onClose={() => setSelectedLead(null)}
         />
      )}
    </div>
  );
};
