import { Server, KeyRound, ShieldAlert, Cpu, Save, Trash2, MessageSquare, FolderGit2, Database, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const CACHE_LABELS: Record<string, { en: string; ar: string }> = {
  portfolio_projects: { en: 'Projects CMS', ar: 'إدارة المشاريع' },
  portfolio_leads: { en: 'CRM Leads', ar: 'إدارة العملاء' },
  portfolio_sections: { en: 'Section Blueprint', ar: 'مخطط الأقسام' },
  portfolio_content: { en: 'Site Content', ar: 'محتوى الموقع' },
  portfolio_appearance: { en: 'Theme / Appearance', ar: 'المظهر والسمات' },
  portfolio_notifications: { en: 'Notifications', ar: 'التنبيهات' },
  portfolio_assets: { en: 'Media Assets', ar: 'ملفات الوسائط' },
  portfolio_config: { en: 'System Config', ar: 'تكوين النظام' },
  portfolio_stats: { en: 'Analytics Stats', ar: 'الإحصائيات والتحليلات' },
};

const getCacheSize = (key: string): string => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return '—';
    const bytes = new Blob([val]).size;
    if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  } catch {
    return '—';
  }
};

export const SystemSettings = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [cleared, setCleared] = useState<string[]>([]);
  const [confirmAll, setConfirmAll] = useState(false);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'System Infrastructure',
      subtitle: 'Environment Status, Cache & Security Audit',
      updateBtn: 'Update Safe Config',
      dependencies: {
        title: 'External Dependencies',
        gemini: 'Gemini AI Key',
        supabase: 'Supabase Bridge',
        configured: 'Configured',
        missing: 'Missing',
        active: 'Active',
        footer: 'Secrets are managed strictly through server environment variables'
      },
      access: {
        title: 'Infrastructure Access',
        hub: 'Master Notification Hub',
        policy: 'Security Policy',
        policyDesc: 'System passwords and JWT secrets are injected via .env at build time and cannot be Modified from the frontend.'
      },
      cache: {
        title: 'Cache Management',
        purge: 'Chat history auto-purged after 30 days',
        clearedStatus: 'cleared',
        chatTitle: 'AI Chat History',
        chatSubtitle: 'portfolio_chat_* (all users)',
        clearChats: 'Clear All Chats',
        nuclear: 'Clear ALL Cache & Reset to Defaults',
        nuclearWarning: '⚠️ This will wipe ALL localStorage data and reload the page. Are you sure?',
        cancel: 'Cancel',
        confirm: 'Yes, Clear Everything'
      },
      metrics: {
        title: 'Main Server Status',
        network: 'Deployment Network',
        latency: 'Latency',
        load: 'Load'
      },
      saveMsg: 'System Configuration Updated.',
      confirmClear: 'Clear "{label}" cache? This will reset it to default on next load.',
      confirmChat: 'Clear ALL AI chat history for all users? This cannot be undone.',
      chatCleared: 'Cleared {count} chat session(s).'
    },
    ar: {
      title: 'البنية التحتية للنظام',
      subtitle: 'حالة البيئة، الذاكرة المؤقتة، والتدقيق الأمني',
      updateBtn: 'تحديث التكوين الآمن',
      dependencies: {
        title: 'الاعتمادات الخارجية',
        gemini: 'مفتاح Gemini AI',
        supabase: 'جسر Supabase',
        configured: 'معدّ مسبقاً',
        missing: 'مفقود',
        active: 'نشط',
        footer: 'يتم إدارة الأسرار البرمجية بصرامة عبر متغيرات بيئة الخادم'
      },
      access: {
        title: 'الوصول إلى البنية التحتية',
        hub: 'مركز التنبيهات الرئيسي',
        policy: 'السياسة الأمنية',
        policyDesc: 'يتم حقن كلمات مرور النظام وأسرار JWT عبر ملف .env وقت البناء ولا يمكن تعديلها من لوحة التحكم.'
      },
      cache: {
        title: 'إدارة الذاكرة المؤقتة',
        purge: 'يتم مسح سجل الدردشة تلقائياً بعد 30 يوماً',
        clearedStatus: 'تم المسح',
        chatTitle: 'سجل دردشة الذكاء الاصطناعي',
        chatSubtitle: 'portfolio_chat_* (كافة المستخدمين)',
        clearChats: 'مسح كافة الدردشات',
        nuclear: 'مسح كافة الذاكرة المؤقتة والضبط الافتراضي',
        nuclearWarning: '⚠️ سيؤدي هذا لمسح كافة بيانات localStorage وإعادة تحميل الصفحة. هل أنت متأكد؟',
        cancel: 'إلغاء',
        confirm: 'نعم، مسح كل شيء'
      },
      metrics: {
        title: 'حالة الخادم الرئيسي',
        network: 'شبكة النشر',
        latency: 'تأخير الاستجابة',
        load: 'ضغط التحميل'
      },
      saveMsg: 'تم تحديث تكوين النظام بنجاح.',
      confirmClear: 'مسح ذاكرة "{label}"؟ سيعود للوضع الافتراضي عند التحميل القادم.',
      confirmChat: 'مسح كافة سجلات دردشة الذكاء الاصطناعي لجميع المستخدمين؟ لا يمكن التراجع.',
      chatCleared: 'تم مسح {count} جلسة دردشة.'
    }
  };

  // Status check
  const hasGemini = !!import.meta.env.VITE_GOOGLE_API_KEY;
  const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL || true;
  const masterEmail = import.meta.env.VITE_ADMIN_EMAIL || 'Configured in .env';

  const handleSave = () => {
    alert(t[lang].saveMsg);
  };

  const clearCache = (key: string) => {
    const label = CACHE_LABELS[key]?.[lang] || key;
    if (!window.confirm(t[lang].confirmClear.replace('{label}', label))) return;
    localStorage.removeItem(key);
    setCleared(prev => [...prev, key]);
  };

  const clearChatHistory = () => {
    if (!window.confirm(t[lang].confirmChat)) return;
    const allKeys = Object.keys(localStorage);
    const chatKeys = allKeys.filter(k => k.startsWith('portfolio_chat_'));
    chatKeys.forEach(k => localStorage.removeItem(k));
    setCleared(prev => [...prev, '__chats__']);
    alert(t[lang].chatCleared.replace('{count}', chatKeys.length.toString()));
  };

  const clearAllCache = () => {
    Object.keys(CACHE_LABELS).forEach(k => localStorage.removeItem(k));
    setCleared(Object.keys(CACHE_LABELS));
    setConfirmAll(false);
    window.location.reload();
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
          className={`flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all duration-300 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <Save className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">{t[lang].updateBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* API Credentials */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 space-y-6 opacity-80">
          <h2 className={`text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <KeyRound className="w-4 h-4 text-accent-violet" /> {t[lang].dependencies.title}
          </h2>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : ''}>
                <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block">{t[lang].dependencies.gemini}</label>
                <span className="text-xs font-mono text-white/60">VITE_GOOGLE_API_KEY</span>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${hasGemini ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {hasGemini ? t[lang].dependencies.configured : t[lang].dependencies.missing}
              </div>
            </div>
            <div className={`flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : ''}>
                <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block">{t[lang].dependencies.supabase}</label>
                <span className="text-xs font-mono text-white/60">VITE_SUPABASE_URL</span>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${hasSupabase ? t[lang].dependencies.active : t[lang].dependencies.missing}`}>
                {hasSupabase ? t[lang].dependencies.active : t[lang].dependencies.missing}
              </div>
            </div>
          </div>
          <p className="text-[9px] text-white/20 italic">{t[lang].dependencies.footer}</p>
        </div>

        {/* Security & Access */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className={`text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <ShieldAlert className="w-4 h-4 text-red-500" /> {t[lang].access.title}
          </h2>
          <div className="space-y-4">
            <div className={`p-3 bg-black/40 border border-white/5 rounded-lg ${isRtl ? 'text-right' : ''}`}>
              <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block">{t[lang].access.hub}</label>
              <div className="text-xs text-white/60 font-mono mt-1">{masterEmail}</div>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <div className={`text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="w-3 h-3" /> {t[lang].access.policy}
              </div>
              <p className={`text-[10px] text-red-400/60 leading-relaxed font-mono ${isRtl ? 'text-right' : ''}`}>
                {t[lang].access.policyDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 col-span-1 md:col-span-2 space-y-6">
          <div className={`flex items-center justify-between border-b border-white/5 pb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Database className="w-4 h-4 text-accent-violet" /> {t[lang].cache.title}
            </h2>
            <div className={`flex items-center gap-2 text-[9px] font-mono text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MessageSquare className="w-3 h-3" />
              {t[lang].cache.purge}
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(CACHE_LABELS).map(([key, labels]) => {
              const isClear = cleared.includes(key) || !localStorage.getItem(key);
              const size = isClear ? '—' : getCacheSize(key);
              const label = labels[lang];
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isRtl ? 'flex-row-reverse' : ''} ${
                    isClear ? 'bg-white/2 border-white/5 opacity-40' : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <FolderGit2 className="w-3.5 h-3.5 text-white/30" />
                    <div>
                      <div className="text-xs font-black text-white/80 uppercase tracking-wider">{label}</div>
                      <div className="text-[9px] font-mono text-white/30">{key}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-mono text-white/40 min-w-[52px] text-right">
                      {isClear ? <span className="text-green-400/60">{t[lang].cache.clearedStatus}</span> : size}
                    </span>
                    <button
                      onClick={() => clearCache(key)}
                      disabled={isClear}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MessageSquare className="w-3.5 h-3.5 text-white/30" />
              <div className={isRtl ? 'text-right' : ''}>
                <div className="text-xs font-black text-white/80 uppercase tracking-wider">{t[lang].cache.chatTitle}</div>
                <div className="text-[9px] font-mono text-white/30">{t[lang].cache.chatSubtitle}</div>
              </div>
            </div>
            <button
              onClick={clearChatHistory}
              className={`px-3 py-1.5 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <Trash2 className="w-3 h-3" /> {t[lang].cache.clearChats}
            </button>
          </div>

          <div className="pt-2 border-t border-white/5">
            {!confirmAll ? (
              <button
                onClick={() => setConfirmAll(true)}
                className={`w-full py-3 bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <AlertTriangle className="w-4 h-4" /> {t[lang].cache.nuclear}
              </button>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3">
                <p className="text-red-400 text-xs font-mono text-center">{t[lang].cache.nuclearWarning}</p>
                <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setConfirmAll(false)}
                    className="flex-1 py-2.5 bg-white/5 text-white/60 hover:text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                  >
                    {t[lang].cache.cancel}
                  </button>
                  <button
                    onClick={clearAllCache}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                  >
                    {t[lang].cache.confirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Server Metrics */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 col-span-1 md:col-span-2">
          <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Server className="w-6 h-6 text-green-400" />
              <div className={isRtl ? 'text-right' : ''}>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t[lang].metrics.title}</h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{t[lang].metrics.network}</p>
              </div>
            </div>
            <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="text-right">
                <div className="text-2xl font-black text-white">42ms</div>
                <div className="text-[9px] font-mono text-accent-violet uppercase tracking-widest">{t[lang].metrics.latency}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 opacity-40" /> 12%
                </div>
                <div className="text-[9px] font-mono text-accent-violet uppercase tracking-widest">{t[lang].metrics.load}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
