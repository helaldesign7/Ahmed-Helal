import { useAdmin } from '../../contexts/useAdmin';
import { type Language } from '../../data/content';

interface FooterProps {
  lang: Language;
}

export const Footer = ({ lang }: FooterProps) => {
  const { siteContent } = useAdmin();
  const { socials } = siteContent;
  const isRtl = lang === 'ar';

  const t = {
    en: {
      role: 'Visual Designer & Experience Specialist',
      rights: 'ALL RIGHTS RESERVED',
      brand: 'AHMED HELAL'
    },
    ar: {
      role: 'مصمم بصري وأخصائي تجربة المستخدم',
      rights: 'جميع الحقوق محفوظة',
      brand: 'أحمد هلال'
    }
  };

  return (
    <footer className={`py-16 px-8 md:px-16 bg-primary-black border-t border-white/5 relative z-10 ${isRtl ? 'rtl font-arabic' : 'ltr'}`}>
       <div className={`max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left ${isRtl ? 'md:flex-row-reverse md:text-right' : ''}`}>
          
          <div className={`flex flex-col items-center gap-3 ${isRtl ? 'md:items-end' : 'md:items-start'}`}>
             <div className="font-heading font-black text-3xl tracking-tighter text-white uppercase italic">
                {t[lang].brand}
             </div>
             <p className={`text-white/20 text-[10px] font-black uppercase tracking-[0.3em] ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                {t[lang].role}
             </p>
          </div>
          
          <div className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ${isRtl ? 'flex-row-reverse' : ''}`}>
             {(socials || []).filter(s => s.isActive && s.url).map(social => (
               <a 
                 key={social.id}
                 href={social.url} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="hover:text-accent-violet transition-all duration-300 hover:scale-110 active:scale-95"
               >
                 {social.platform}
               </a>
             ))}
          </div>

          <div className={`text-[9px] font-black uppercase tracking-[0.4em] text-white/10 ${isRtl ? 'font-arabic' : 'font-mono'}`}>
             © {new Date().getFullYear()} {isRtl ? 'أحمد هلال' : 'AHMED HELAL'} <span className="mx-2">|</span> {t[lang].rights}
          </div>
       </div>
    </footer>
  );
};
