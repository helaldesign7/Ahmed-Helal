import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Palette, 
  FolderGit2, 
  MessagesSquare, 
  Bot, 
  Database,
  Settings,
  LogOut,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/useAdmin';



interface SidebarProps {
  lang: 'en' | 'ar';
}

export const Sidebar = ({ lang }: SidebarProps) => {
  const { logout, user } = useAuth();
  const { conversations } = useAdmin();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  const t = {
    en: {
      core: 'Admin Core',
      terminate: 'Terminate Session',
      nav: {
        overview: 'Overview',
        appearance: 'Appearance',
        projects: 'Projects',
        blueprint: 'Blueprint & Content',
        crm: 'CRM & Leads',
        ai: 'AI Assistant',
        media: 'Media Assets',
        system: 'System'
      }
    },
    ar: {
      core: 'نواة النظام',
      terminate: 'إنهاء الجلسة',
      nav: {
        overview: 'نظرة عامة',
        appearance: 'المظهر والسمات',
        projects: 'المشاريع',
        blueprint: 'الهيكلية والمحتوى',
        crm: 'العملاء والطلبات',
        ai: 'مساعد الذكاء الاصطناعي',
        media: 'مكتبة الوسائط',
        system: 'إعدادات النظام'
      }
    }
  };

  const navItems = [
    { name: t[lang].nav.overview, path: '/admin', icon: LayoutDashboard },
    { name: t[lang].nav.appearance, path: '/admin/theme', icon: Palette },
    { name: t[lang].nav.projects, path: '/admin/projects', icon: FolderGit2 },
    { name: t[lang].nav.blueprint, path: '/admin/content', icon: Database },
    { name: t[lang].nav.crm, path: '/admin/crm', icon: MessagesSquare },
    { name: t[lang].nav.ai, path: '/admin/ai', icon: Bot },
    { name: t[lang].nav.media, path: '/admin/media', icon: HardDrive },
    { name: t[lang].nav.system, path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className={`w-64 h-screen flex flex-col bg-[#080808] border-r border-white/5 sticky top-0 shrink-0 z-40 selection:bg-accent-violet/30 ${isRtl ? 'border-l border-r-0' : 'border-r'}`}>
      
      {/* Brand Header */}
      <div className={`h-20 flex items-center px-6 border-b border-white/5 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-accent-violet/20 flex items-center justify-center border border-accent-violet/30">
            <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse" />
          </div>
          <div className={isRtl ? 'text-right' : ''}>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Hela.OS</h2>
            <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] block -mt-0.5">{t[lang].core}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${isRtl ? 'flex-row-reverse text-right' : ''}
              ${isActive 
                ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20 shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent'}
            `}
          >
            <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
            {item.path === '/admin/ai' && conversations.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full bg-accent-violet text-[8px] font-mono text-white ml-auto animate-pulse ${isRtl ? 'mr-auto ml-0' : 'ml-auto'}`}>
                {conversations.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-black/20">
        <div className={`flex items-center gap-3 px-2 mb-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-[#0C0C0C] border border-white/10 flex items-center justify-center">
            <span className="text-xs font-black text-white">{user?.name.charAt(0)}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest truncate">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <LogOut className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].terminate}</span>
        </button>
      </div>

    </aside>
  );
};
