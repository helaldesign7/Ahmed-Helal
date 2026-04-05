import { Users, MessagesSquare, Eye, FolderGit2 } from 'lucide-react';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';
import type { Lead, Project } from '../../types/admin';

export const DashboardOverview = () => {
  const { projects, leads, stats } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Command Center',
      subtitle: 'System status and overview',
      requests: 'Project Requests',
      new: 'New',
      active: 'Active Leads',
      progress: 'In Progress',
      traffic: 'Site Traffic',
      live: 'Live',
      caseStudies: 'Case Studies',
      featured: 'Featured',
      recent: 'Recent Project Requests',
      user: 'User / Lead',
      interest: 'Interest',
      status: 'Status',
      date: 'Date',
      clear: 'All systems clear',
      newStatus: 'new',
      progressStatus: 'in progress'
    },
    ar: {
      title: 'مركز التحكم',
      subtitle: 'حالة النظام والنظرة العامة',
      requests: 'طلبات المشاريع',
      new: 'جديد',
      active: 'عملاء مهتمون',
      progress: 'قيد التنفيذ',
      traffic: 'زيارات الموقع',
      live: 'مباشر',
      caseStudies: 'دراسات الحالة',
      featured: 'مميز',
      recent: 'أحدث طلبات المشاريع',
      user: 'المستخدم / العميل',
      interest: 'الاهتمام',
      status: 'الحالة',
      date: 'التاريخ',
      clear: 'كل الأنظمة تعمل بكفاءة',
      newStatus: 'جديد',
      progressStatus: 'قيد العمل'
    }
  };

  const statCards = [
    { label: t[lang].requests, value: leads.length.toString(), icon: MessagesSquare, trend: `+${leads.filter((l: Lead) => l.status === 'new').length} ${t[lang].new}` },
    { label: t[lang].active, value: leads.filter((l: Lead) => l.status === 'in_progress').length.toString(), icon: Users, trend: t[lang].progress },
    { label: t[lang].traffic, value: stats.visits.toLocaleString(), icon: Eye, trend: `${stats.activeUsers} ${t[lang].live}` },
    { label: t[lang].caseStudies, value: projects.filter((p: Project) => p.status === 'published').length.toString(), icon: FolderGit2, trend: `+${projects.filter((p: Project) => p.isFeatured).length} ${t[lang].featured}` },
  ];

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      
      <div>
        <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
        <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-primary-black border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-accent-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`flex justify-between items-start mb-4 relative z-10`}>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <stat.icon className="w-5 h-5 text-accent-violet" />
              </div>
              <span className="text-xs font-mono font-bold text-accent-violet bg-accent-violet/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-black border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6 px-4">{t[lang].recent}</h2>
        
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-white/60">
            <thead className="text-[10px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5">
              <tr>
                <th className={`px-4 py-3 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].user}</th>
                <th className={`px-4 py-3 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].interest}</th>
                <th className={`px-4 py-3 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].status}</th>
                <th className={`px-4 py-3 font-medium ${isRtl ? 'text-left' : 'text-right'}`}>{t[lang].date}</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-white text-xs">{lead.name}</div>
                    <div className="text-[10px] font-mono opacity-60">{lead.email}</div>
                  </td>
                  <td className="px-4 py-4 text-xs">{lead.interest}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 border rounded text-[10px] font-mono uppercase tracking-wider ${
                      lead.status === 'new' ? 'bg-accent-violet/20 text-accent-violet border-accent-violet/30' :
                      lead.status === 'in_progress' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-white/5 text-white/40 border-white/10'
                    }`}>
                      {lead.status === 'new' ? t[lang].newStatus : 
                       lead.status === 'in_progress' ? t[lang].progressStatus : 
                       lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-xs font-mono ripple-effect ${isRtl ? 'text-left' : 'text-right'}`}>{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

