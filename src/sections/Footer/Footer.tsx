import { useAdmin } from '../../contexts/useAdmin';
import { type Language } from '../../data/content';

interface FooterProps {
  lang: Language;
}

export const Footer = ({ lang }: FooterProps) => {
  const { siteContent } = useAdmin();
  const { socials } = siteContent;
  const isRtl = lang === 'ar';

  const { brandName, role, extraDetails } = siteContent.footer || {
    brandName: { en: 'AHMED HELAL', ar: 'أحمد هلال' },
    role: { en: 'Visual Designer', ar: 'مصمم بصري' },
    extraDetails: { en: '', ar: '' }
  };

  return (
    <footer className={`py-16 px-8 md:px-16 bg-primary-black border-t border-white/5 relative z-10 ${isRtl ? 'rtl font-arabic' : 'ltr'}`}>
       <div className={`max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left ${isRtl ? 'md:flex-row-reverse md:text-right' : ''}`}>
          
          <div className={`flex flex-col items-center gap-3 ${isRtl ? 'md:items-end' : 'md:items-start'}`}>
             <div className="font-heading font-black text-3xl tracking-tighter text-white uppercase italic">
                {brandName[lang] || brandName.en}
             </div>
             {role?.[lang] && (
               <p className={`text-white/20 text-[10px] font-black uppercase tracking-[0.3em] ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                  {role[lang]}
               </p>
             )}
             {extraDetails?.[lang] && (
               <p className="text-white/10 text-[9px] max-w-[250px] leading-relaxed uppercase tracking-wider block mt-2 opacity-60">
                 {extraDetails[lang]}
               </p>
             )}
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
             © {new Date().getFullYear()} {brandName[lang] || brandName.en} <span className="mx-2">|</span> {isRtl ? 'جميع الحقوق محفوظة' : 'ALL RIGHTS RESERVED'}
          </div>
       </div>
    </footer>
  );
};
