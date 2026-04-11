import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';

interface LaptopSectionProps {
  lang: Language;
}

type ViewState = 'home' | 'portfolio' | 'cv';

import { FaWhatsapp, FaInstagram, FaLinkedin, FaBehance, FaDribbble, FaGithub, FaPinterest } from 'react-icons/fa6';
import { Mail, Phone } from 'lucide-react';

const SocialIcon = ({ platform, link, brandColor }: { platform: string; link: string; brandColor: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    whatsapp: <FaWhatsapp className="w-full h-full" />,
    instagram: <FaInstagram className="w-full h-full" />,
    linkedin: <FaLinkedin className="w-full h-full" />,
    behance: <FaBehance className="w-full h-full" />,
    dribbble: <FaDribbble className="w-full h-full" />,
    github: <FaGithub className="w-full h-full" />,
    pinterest: <FaPinterest className="w-full h-full" />,
    phone: <Phone className="w-full h-full" />,
    email: <Mail className="w-full h-full" />
  };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.1, color: brandColor }}
      className={`w-4 h-4 sm:w-6 sm:h-6 text-white/20 transition-all duration-300 pointer-events-auto relative z-50`}
    >
      {iconMap[platform] || <Mail className="w-full h-full" />}
    </motion.a>
  );
};

export const LaptopSection = ({ lang }: LaptopSectionProps) => {
  const { siteContent } = useAdmin();
  const [view, setView] = useState<ViewState>('home');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isExpanded = view !== 'home';
  const { laptop, socials } = siteContent;
  const sectionRef = useRef<HTMLElement>(null);

  const brandColors: Record<string, string> = {
    whatsapp: "#25D366",
    behance: "#0057ff",
    linkedin: "#0077b5",
    instagram: "#E1306C",
    email: "#FFFFFF",
    phone: "#34d399",
    pinterest: "#E60023",
    github: "#FFFFFF",
    dribbble: "#ea4c89"
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const laptopY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);
  const laptopRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]); // Neutralized for phone safety
  const laptopZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);

  const profileImg = laptop?.profileImage || 'https://drive.google.com/thumbnail?id=17qG2FN1G6Qf14UYZmm_i1VhqRVQbsdK0&sz=w1000';
  const portfolioUrl = laptop?.portfolioUrl || 'https://drive.google.com/file/d/18aE8ZHMtayUz8leq0s25YE9gPxXgCRiS/preview';
  const cvUrl = laptop?.cvUrl || 'https://drive.google.com/file/d/1TkqQ73kCRD64WRCGDJdSZkOgBA0t0vTJ/preview';
  const screenBgColor = laptop?.screenBackgroundColor || 'rgba(139, 92, 246, 0.1)';
  const screenBgImage = laptop?.screenBackgroundImage || '';

  return (
    <section 
      ref={sectionRef}
      style={{ position: 'relative' }}
      className="relative min-h-[120vh] bg-primary-black py-20 flex flex-col items-center justify-center -mt-20 md:-mt-32 overflow-hidden"
    >
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] bg-accent-violet/3 rounded-full blur-[350px] pointer-events-none" />

      {/* Profile Image Modal - Premium Frame */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative max-w-2xl w-full aspect-square p-2 bg-white/5 border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Inner Frame Styling */}
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
              <img 
                src={profileImg} 
                className="w-full h-full object-cover rounded-[32px] shadow-2xl" 
                alt="Profile Large" 
              />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/50 text-xs font-mono tracking-widest uppercase">
                Secure Viewer Active
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full flex flex-col items-center shrink-0">
        <motion.h2 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="z-0 w-full max-w-4xl text-center px-6 mb-12 sm:mb-20 text-3xl md:text-5xl font-black tracking-tighter uppercase text-white/5 select-none"
        >
          Visual Core Hub
        </motion.h2>

        <div className="w-full flex items-center justify-center relative">
          <motion.div 
            style={{ 
              y: laptopY,
              rotateX: laptopRotateX,
              translateZ: laptopZ,
            }}
            className="w-full flex items-center justify-center"
          >
            <motion.div
              animate={isExpanded ? {
                scale: [1, 1.02],
                y: 10,
              } : {
                scale: [1, 1],
                y: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[95%] sm:w-[85%] max-w-5xl aspect-4/3 md:aspect-16/10"
            >
              <div className="w-full h-full relative">

                {/* LID ARQUITECTURE - Fixed for all phones */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-full z-30"
                >
                  <div 
                    className="absolute inset-0 bg-[#080808] rounded-t-[20px] sm:rounded-t-[40px] overflow-hidden shadow-[0_-30px_100px_rgba(0,0,0,1)] border border-white/10 flex flex-col h-full"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none">
                       {screenBgImage ? (
                         <img src={screenBgImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                       ) : (
                         <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${screenBgColor}, transparent)` }} />
                       )}
                    </div>

                    <div className="h-6 sm:h-10 w-full bg-black/90 border-b border-white/5 flex items-center px-4 sm:px-6 justify-between shrink-0 relative z-50">
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/10" />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-[5px] sm:text-[8px] font-mono font-black text-white/20 tracking-[0.6em] select-none uppercase">
                         Node.Active
                         <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                      </div>
                      <div className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 relative z-20 overflow-hidden bg-black/40 w-full h-full flex flex-col items-center">
                      <AnimatePresence mode="wait">
                        {view === 'home' ? (
                          <motion.div
                            key="profile"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full flex flex-col justify-between items-center py-4 px-4 sm:py-10 text-center"
                          >
                             <div className="w-full flex justify-between items-start opacity-20 px-2 select-none">
                                <span className="font-mono text-[4px] sm:text-[8px] uppercase tracking-widest text-left leading-none">Est_2024<br/>Secure Node</span>
                                <div className="text-right font-mono text-[4px] sm:text-[8px] uppercase tracking-widest leading-none">Alex_EG<br/>Status_OK</div>
                             </div>

                             <div className="relative flex flex-col items-center flex-1 justify-center py-1">
                                <motion.div 
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 5, repeat: Infinity }}
                                  onClick={() => setIsImageModalOpen(true)}
                                  className="group relative mb-2 sm:mb-8 w-12 h-12 sm:w-28 sm:h-28 p-0.5 bg-linear-to- from-accent-violet/20 to-white/5 rounded-full cursor-pointer overflow-visible"
                                >
                                   <div className="absolute inset-0 bg-accent-violet/10 rounded-full blur-[15px] sm:blur-2xl" />
                                   <img src={profileImg} className="relative w-full h-full rounded-full border border-white/10 bg-gh-dark object-cover z-10 transition-transform duration-500 group-hover:scale-110" />
                                   
                                   {/* Hint Notification (Pulsing) */}
                                   <motion.div
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: [0, 1, 1, 0], x: [20, 10, 10, 20] }}
                                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                                      className="absolute left-full top-1/2 -translate-y-1/2 ml-4 whitespace-nowrap bg-accent-violet/90 text-white text-[5px] sm:text-[7px] font-black uppercase px-2 py-1 rounded-sm tracking-[0.2em] shadow-lg pointer-events-none"
                                   >
                                      {lang === 'ar' ? 'انقر للتوسيع' : 'Click to Expand'}
                                   </motion.div>

                                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-accent-violet rounded-full border border-black flex items-center justify-center z-20">
                                      <Sparkles className="w-2 h-2 text-white" />
                                   </div>
                                </motion.div>

                                 <div className="relative z-50">
                                   <h3 className="text-base sm:text-5xl font-black tracking-tighter uppercase text-white mb-0.5 leading-none select-none">
                                      {laptop?.name?.[lang] || ''}
                                   </h3>
                                   <div className="text-accent-violet font-mono text-[5px] sm:text-[10px] uppercase tracking-[0.3em] font-black mb-1 sm:mb-4 opacity-80 select-none">
                                      {laptop?.jobTitle?.[lang] || ''}
                                   </div>
                                   <p className="text-white/30 text-[4px] sm:text-[10px] leading-relaxed max-w-[140px] sm:max-w-md mx-auto tracking-wide">
                                      {laptop?.intro?.[lang] || ''}
                                   </p>
                                 </div>
                             </div>

                             <div className="flex flex-col items-center gap-2 sm:gap-6 w-full mt-auto">
                                <div className="flex flex-row items-center justify-center gap-2 sm:gap-5 w-full max-w-[240px] sm:max-w-none">
                                   <motion.button
                                      onClick={(e) => { e.stopPropagation(); setView('portfolio'); }}
                                      className="btn-glass flex-1 sm:flex-none px-3 sm:px-10 py-1.5 sm:py-3.5 bg-accent-violet text-white text-[5px] sm:text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer"
                                   >
                                      {laptop?.ctas?.portfolio?.[lang] || 'Portfolio'}
                                   </motion.button>
                                   <motion.button
                                      onClick={(e) => { e.stopPropagation(); setView('cv'); }}
                                      className="btn-glass flex-1 sm:flex-none px-3 sm:px-8 py-1.5 sm:py-3.5 bg-white/5 text-white/50 text-[5px] sm:text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer"
                                   >
                                      {laptop?.ctas?.cv?.[lang] || 'CV'}
                                   </motion.button>
                                </div>

                                <div className="flex items-center justify-center gap-3 sm:gap-8 opacity-40 pb-2">
                                   {(socials || []).filter(s => s.isActive && s.url).map(social => (
                                     <SocialIcon 
                                        key={social.id}
                                        platform={social.platform} 
                                        link={social.url}
                                        brandColor={brandColors[social.platform] || "#FFFFFF"}
                                     />
                                   ))}
                                </div>
                             </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="viewer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-x-0 top-0 bottom-0 w-full bg-black z-40 overflow-hidden"
                          >
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50 flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setView('home'); }}
                                className="btn-glass p-3 md:p-4 bg-primary-black text-white hover:text-accent-violet cursor-pointer flex items-center gap-2"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden md:inline">{laptop?.ctas?.back?.[lang] || 'Back'}</span>
                              </button>
                            </div>
                            <iframe 
                              src={view === 'portfolio' ? portfolioUrl : cvUrl} 
                              className="w-full h-full border-none bg-gh-dark"
                              title="Viewer"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="h-4 sm:h-8 w-full bg-black border-t border-white/5 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none">
                       <span className="text-[4px] sm:text-[8px] font-mono text-white/10 tracking-widest uppercase">System_Active_V4</span>
                    </div>
                  </div>
                </motion.div>

                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-full h-[15%] z-10 pointer-events-none"
                  style={{ transform: "rotateX(-80deg)", transformOrigin: "top center" }}
                >
                  <div className="absolute inset-0 bg-[#0C0C0C] rounded-b-[24px] sm:rounded-b-[48px] border-b-8 border-white/5 shadow-[0_60px_150px_rgba(0,0,0,1)]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

