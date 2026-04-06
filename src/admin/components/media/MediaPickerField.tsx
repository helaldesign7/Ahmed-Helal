import { useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { MediaManagerModal } from './MediaManagerModal';

interface MediaPickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  lang: 'en' | 'ar';
}

export const MediaPickerField = ({ label, value, onChange, lang }: MediaPickerFieldProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const isRtl = lang === 'ar';

  const isImage = value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || value.includes('images.unsplash.com') || value.includes('portfolio_media');

  const t = {
    en: {
      choose: 'Library Pick',
      manual: 'Manual URL',
      placeholder: 'Enter external image/video URL...',
      current: 'Current Asset'
    },
    ar: {
      choose: 'اختيار من المكتبة',
      manual: 'رابط يدوي',
      placeholder: 'أدخل رابط خارجي...',
      current: 'الملف الحالي'
    }
  };

  return (
    <div className={`mb-6 bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent-violet/20 transition-all ${isRtl ? 'text-right' : ''}`}>
      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">
        {label}
      </label>

      <div className={`flex flex-col md:flex-row gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
        {/* Preview Area */}
        <div className="w-full md:w-32 h-32 rounded-xl bg-black border border-white/5 overflow-hidden shrink-0 flex items-center justify-center relative group">
          {value && isImage ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <ImageIcon className="w-8 h-8 text-white/10" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">{t[lang].current}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-4">
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-accent-violet text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-violet/80 transition-all shadow-lg hover:shadow-accent-violet/20 flex items-center gap-2"
            >
              <ImageIcon className="w-3.5 h-3.5" /> {t[lang].choose}
            </button>
            <button 
              onClick={() => setIsManual(!isManual)}
              className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isManual ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {(isManual || !value) && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
               <input 
                 type="text"
                 value={value}
                 onChange={(e) => onChange(e.target.value)}
                 className={`w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent-violet outline-none transition-all font-mono ${isRtl ? 'text-right' : ''}`}
                 placeholder={t[lang].placeholder}
               />
            </div>
          )}

          {value && !isManual && (
            <div className={`flex items-center gap-2 text-[10px] font-mono text-accent-violet/60 ${isRtl ? 'flex-row-reverse' : ''}`}>
               <CheckCircle2 className="w-3.5 h-3.5" />
               <span className="truncate max-w-[200px]">{value}</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <MediaManagerModal 
          mode="pick" 
          lang={lang} 
          onClose={() => setIsModalOpen(false)} 
          onSelect={(asset) => {
            onChange(asset.full_url);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
