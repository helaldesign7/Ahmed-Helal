import { Plus, Trash2, GripVertical, XCircle, Link as LinkIcon, Globe } from 'lucide-react';
import { useAdmin } from '../../../contexts/useAdmin';
import type { MarqueeLogo } from '../../../types/admin';

export const ClientLogosManager = ({ onClose, lang = 'en' }: { onClose: () => void, lang?: 'en' | 'ar' }) => {
  const { siteContent, updateSectionArray } = useAdmin();
  const logos = siteContent.marquee.logos || [];
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Client Logos',
      subtitle: 'Manage brand ecosystem',
      add: 'Add Logo',
      brandName: 'Brand Name',
      url: 'Image URL',
      confirm: 'Remove brand from list?',
      stats: 'ACTIVE NODES'
    },
    ar: {
      title: 'شعارات العملاء',
      subtitle: 'إدارة نظام العلامات التجارية',
      add: 'إضافة شعار',
      brandName: 'اسم العلامة',
      url: 'رابط الصورة',
      confirm: 'هل تريد إزالة هذه العلامة من القائمة؟',
      stats: 'العناصر النشطة'
    }
  };

  const handleAdd = () => {
    const newLogo: MarqueeLogo = {
      name: lang === 'ar' ? 'علامة تجارية جديدة' : 'New Brand',
      image: 'https://cdn.worldvectorlogo.com/logos/adobe-2.svg'
    };
    updateSectionArray('marquee', 'logos', [...logos, newLogo]);
  };

  const handleDelete = (index: number) => {
    if (confirm(t[lang].confirm)) {
      const next = [...logos];
      next.splice(index, 1);
      updateSectionArray('marquee', 'logos', next);
    }
  };

  const handleUpdate = (index: number, field: keyof MarqueeLogo, value: string) => {
    const next = [...logos];
    next[index] = { ...next[index], [field]: value };
    updateSectionArray('marquee', 'logos', next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`w-full max-w-5xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${isRtl ? 'text-right' : ''}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-xl font-black tracking-widest uppercase bg-linear-to-r from-white to-white/40 bg-clip-text text-transparent">{t[lang].title}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] font-mono text-accent-violet uppercase tracking-[0.2em]">{logos.length} {t[lang].stats}</span>
               <span className="w-1 h-1 rounded-full bg-white/10" />
               <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">{t[lang].subtitle}</p>
            </div>
          </div>
          <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent-violet/20"
            >
              <Plus className="w-4 h-4" /> {t[lang].add}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <XCircle className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {logos.map((logo, idx) => (
              <div key={idx} className="bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden group hover:border-accent-violet/30 transition-all duration-500 flex flex-col shadow-xl">
                
                {/* Preview Area */}
                <div className="aspect-video bg-black/40 relative flex items-center justify-center p-8 group/preview overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className={`absolute top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 ${isRtl ? 'left-3' : 'right-3'}`}>
                      <button className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                         <GripVertical className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(idx)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>

                   <img src={logo.image} alt={logo.name} className="max-w-[80%] max-h-[80%] object-contain grayscale invert opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>

                {/* Info Area */}
                <div className={`p-4 space-y-3 bg-[#0f0f0f]/50 border-t border-white/5 ${isRtl ? 'text-right' : ''}`}>
                  <div className="space-y-1">
                     <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Globe className="w-3 h-3" /> {t[lang].brandName}
                     </label>
                     <input 
                       type="text" 
                       value={logo.name} 
                       onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                       className="w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-white/5 focus:text-accent-violet transition-colors" 
                       placeholder="..." 
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <LinkIcon className="w-3 h-3 text-accent-violet/50" /> {t[lang].url}
                     </label>
                     <input 
                       type="text" 
                       dir="ltr"
                       value={logo.image} 
                       onChange={(e) => handleUpdate(idx, 'image', e.target.value)}
                       className="w-full bg-transparent text-[9px] font-mono text-white/40 outline-none truncate hover:text-white focus:text-white transition-colors" 
                       placeholder="https://..." 
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/2 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] text-center">
           BRAND ECOSYSTEM MATRIX ACCESSED
        </div>
      </div>
    </div>
  );
};
