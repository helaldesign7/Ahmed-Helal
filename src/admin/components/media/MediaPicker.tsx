import { useState } from 'react';
import { Image as ImageIcon, Search, Trash2 } from 'lucide-react';
import { MediaManagerModal } from './MediaManagerModal';
import { useOutletContext } from 'react-router-dom';
import type { MediaAsset } from '../../../types/admin';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const MediaPicker = ({ value, onChange, label }: MediaPickerProps) => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = lang === 'ar';

  const t = {
    en: {
      defaultLabel: "Featured Media",
      placeholder: "Enter URL or pick from library...",
      openLibrary: "Open Library",
      previewError: "No Preview",
      clear: "Clear Field"
    },
    ar: {
      defaultLabel: "الوسائط المميزة",
      placeholder: "أدخل رابطاً أو اختر من المكتبة...",
      openLibrary: "فتح المكتبة",
      previewError: "لا توجد معاينة",
      clear: "مسح الحقل"
    }
  };

  const handleSelect = (asset: MediaAsset) => {
    onChange(asset.full_url);
    setIsOpen(false);
  };

  const finalLabel = label || t[lang].defaultLabel;

  return (
    <div className={`space-y-4 ${isRtl ? 'text-right' : ''}`}>
      <label className={`block text-[10px] font-mono font-black text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>
        {finalLabel}
      </label>
      
      <div className={`flex gap-4 items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 relative group">
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-black/50 border border-white/10 rounded-2xl py-4 text-xs text-white focus:outline-none focus:border-accent-violet transition-all font-mono ${isRtl ? 'pl-20 pr-5 text-right' : 'pr-20 pl-5'}`}
            placeholder={t[lang].placeholder}
            dir={isRtl && !value ? 'rtl' : 'ltr'}
          />
          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 ${isRtl ? 'left-3' : 'right-3'}`}>
            {value && (
              <button 
                type="button"
                onClick={() => onChange('')}
                className="p-2.5 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10"
                title={t[lang].clear}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              type="button"
              onClick={() => setIsOpen(true)}
              className="p-2.5 rounded-xl bg-accent-violet/10 text-accent-violet hover:bg-accent-violet hover:text-white transition-all border border-accent-violet/20 shadow-lg shadow-accent-violet/10"
              title={t[lang].openLibrary}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="w-14 h-14 rounded-2xl bg-[#0c0c0c] border border-white/5 overflow-hidden shrink-0 group relative ring-1 ring-white/5 shadow-2xl">
           {value ? (
             <img 
               src={value} 
               alt="Preview" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = `https://via.placeholder.com/150?text=${t[lang].previewError.replace(' ', '+')}`;
               }}
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center opacity-20">
                <ImageIcon className="w-6 h-6" />
             </div>
           )}
        </div>
      </div>

      {isOpen && (
        <MediaManagerModal 
          lang={lang}
          mode="pick"
          onClose={() => setIsOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};
