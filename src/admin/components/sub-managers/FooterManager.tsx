import { XCircle, Type, Layout } from 'lucide-react';
import { useAdmin } from '../../../contexts/useAdmin';

export const FooterManager = ({ onClose, lang = 'en' }: { onClose: () => void, lang?: 'en' | 'ar' }) => {
  const { siteContent, updateSection } = useAdmin();
  const footer = siteContent.footer || {
    brandName: { en: 'AHMED HELAL', ar: 'أحمد هلال' },
    role: { en: '', ar: '' },
    extraDetails: { en: '', ar: '' }
  };
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Footer Customization',
      subtitle: 'Global brand anchors & copyright details',
      brand: 'Brand Identity',
      role: 'Creative Role / Profession',
      extra: 'Footer Extra Story',
      placeholders: {
        brand: 'Your name or brand title...',
        role: 'Visual Designer, Art Director...',
        extra: 'Strategic description or personal tagline...'
      }
    },
    ar: {
      title: 'تخصيص أسفل الصفحة',
      subtitle: 'هوية العلامة وبيانات حقوق الملكية',
      brand: 'هوية العلامة التجارية',
      role: 'الدور الإبداعي / المهنة',
      extra: 'تفاصيل إضافية في الفوتر',
      placeholders: {
        brand: 'اسمك أو اسم العلامة الخاصة بك...',
        role: 'مصمم بصري، مدير فني...',
        extra: 'وصف استراتيجي أو شعار شخصي...'
      }
    }
  };

  const handleChange = (field: string, subField: string, value: string) => {
    updateSection('footer', {
      ...footer,
      [field]: {
        ...footer[field as keyof typeof footer],
        [subField]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] ${isRtl ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between p-6 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-lg font-black tracking-widest uppercase text-white">{t[lang].title}</h2>
            <p className="text-xs font-mono text-white/40 uppercase mt-1">{t[lang].subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Brand Name */}
          <section className="space-y-4">
             <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Layout className="w-4 h-4 text-accent-violet" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">{t[lang].brand}</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">English</label>
                   <input 
                    type="text"
                    value={footer.brandName.en}
                    onChange={(e) => handleChange('brandName', 'en', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50"
                    placeholder={t[lang].placeholders.brand}
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">العربية</label>
                   <input 
                    type="text"
                    dir="rtl"
                    value={footer.brandName.ar}
                    onChange={(e) => handleChange('brandName', 'ar', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50 text-right"
                    placeholder={t[lang].placeholders.brand}
                   />
                </div>
             </div>
          </section>

          {/* Role */}
          <section className="space-y-4">
             <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Type className="w-4 h-4 text-accent-violet" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">{t[lang].role}</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">English</label>
                   <input 
                    type="text"
                    value={footer.role.en}
                    onChange={(e) => handleChange('role', 'en', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50"
                    placeholder={t[lang].placeholders.role}
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">العربية</label>
                   <input 
                    type="text"
                    dir="rtl"
                    value={footer.role.ar}
                    onChange={(e) => handleChange('role', 'ar', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50 text-right"
                    placeholder={t[lang].placeholders.role}
                   />
                </div>
             </div>
          </section>

          {/* Extra Details */}
          <section className="space-y-4">
             <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Type className="w-4 h-4 text-accent-violet" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">{t[lang].extra}</h3>
             </div>
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">English Description</label>
                   <textarea 
                    rows={3}
                    value={footer.extraDetails.en}
                    onChange={(e) => handleChange('extraDetails', 'en', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-violet/50 resize-none"
                    placeholder={t[lang].placeholders.extra}
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">الوصف بالعربية</label>
                   <textarea 
                    rows={3}
                    dir="rtl"
                    value={footer.extraDetails.ar}
                    onChange={(e) => handleChange('extraDetails', 'ar', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-violet/50 resize-none text-right"
                    placeholder={t[lang].placeholders.extra}
                   />
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};
