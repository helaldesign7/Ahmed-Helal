import { useState, useEffect, type FC } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Hero } from '../sections/Hero/Hero';
import { LaptopSection } from '../sections/LaptopSection/LaptopSection';
import { FeaturedWork } from '../sections/FeaturedWork/FeaturedWork';
import { Services } from '../sections/Services/Services';
import { Marquee } from '../sections/Marquee/Marquee';
import { Process } from '../sections/Process/Process';
import { Testimonials } from '../sections/Testimonials/Testimonials';
import { Metrics } from '../sections/Metrics/Metrics';
import { AIAssistant } from '../sections/AIAssistant/AIAssistant';
import { StartProject } from '../sections/StartProject/StartProject';
import { ContactCTA } from '../sections/ContactCTA/ContactCTA';
import { Footer } from '../sections/Footer/Footer';
import { Navbar } from '../components/common/Navbar';
import { type Language } from '../data/content';
import { useAdmin } from '../contexts/useAdmin';
import { useMobileBack } from '../hooks/useMobileBack';

export const PublicHome: FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const { sections, siteContent } = useAdmin();
  useMobileBack();

  // Modern Custom Cursor State
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 20, stiffness: 400, mass: 0.1 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const sectionComponentMap: Record<string, FC<{lang: Language, id?: string}>> = {
    hero: Hero,
    laptop: LaptopSection,
    projects: FeaturedWork,
    services: Services,
    marquee: Marquee,
    process: Process,
    'start-project': StartProject,
    testimonials: Testimonials,
    metrics: Metrics,
    contact: ContactCTA
  };

  return (
    <main 
      className={`min-h-screen text-white selection:bg-accent-violet/30 cursor-none [&_a]:cursor-none [&_button]:cursor-none ${lang === 'ar' ? 'rtl font-arabic' : 'ltr uppercase-none'}`}
    >
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-violet/60 pointer-events-none z-9999 items-center justify-center mix-blend-screen shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hidden md:flex"
        style={{ x: smoothCursorX, y: smoothCursorY }}
      >
         <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>

      <Navbar lang={lang} onLanguageToggle={toggleLanguage} />

      {sections
        .filter(s => s.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((section, index) => {
        const Component = sectionComponentMap[section.id];
        if (!Component) return null;
        
        return (
          <div 
            key={section.id} 
            id={section.id}
            className={
              section.id === 'hero' 
                ? 'sticky top-0 h-screen z-0 overflow-hidden' 
                : 'relative z-10 bg-primary-black shadow-[0_-30px_60px_rgba(0,0,0,0.6)]'
            }
          >
             {section.id !== 'hero' && (
               <div className="absolute bottom-full left-0 w-full h-16 bg-linear-to-t from-primary-black via-primary-black/40 to-transparent backdrop-blur-[6px] pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
                  
                  {/* Shooting star */}
                  <motion.div 
                    animate={{ x: ['-200%', '400%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                    className="absolute top-0 left-0 w-64 h-[2px] bg-linear-to-r from-transparent via-accent-violet to-transparent blur-[1px]"
                  />

                  {/* Glass Marquee only in the first separator */}
                  {index === 1 && siteContent?.marquee?.logos && siteContent.marquee.logos.length > 0 && (
                     <div className="absolute bottom-1/2 translate-y-1/2 left-0 w-full overflow-hidden flex items-center">
                        <motion.div
                           animate={{ x: ['0%', '-50%'] }}
                           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                           className="flex items-center w-max opacity-20 mix-blend-screen"
                        >
                          {[...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos, ...siteContent.marquee.logos].map((logo, i) => (
                             <img key={i} src={logo?.image} alt={logo?.name} className="h-4 md:h-5 object-contain px-8 md:px-16 grayscale brightness-200" />
                          ))}
                        </motion.div>
                     </div>
                  )}
               </div>
             )}
             <Component lang={lang} />
          </div>
        );
      })}

      <Footer lang={lang} />
      <AIAssistant lang={lang} />
    </main>
  );
};
