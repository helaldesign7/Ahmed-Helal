import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';

interface HeroProps {
  lang: Language;
}

export const Hero = ({ lang }: HeroProps) => {
  const { siteContent } = useAdmin();
  const ref = useRef<HTMLElement>(null);
  
  // 1. Zero-lag smooth parallax using Framer Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Slower, floatier space-like movement
  const springConfigParallax = { damping: 60, stiffness: 40, mass: 2.5 };
  const smoothX = useSpring(mouseX, springConfigParallax);
  const smoothY = useSpring(mouseY, springConfigParallax);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (typeof window !== 'undefined') {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * -60; // Increased range for deeper parallax
      const y = (clientY / innerHeight - 0.5) * -60;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // 2. Scroll-based exit animations
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 400], [0, -100]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const videoScale = useTransform(scrollY, [0, 800], [1, 1.1]);

  const hero = siteContent?.hero || {
    title: { en: "END OF YEAR\nDESIGN", ar: "تصميم\nنهاية العام" },
    subtitle: { en: "Crafting immersive digital experiences through cinematic design.", ar: "صناعة تجارب رقمية غامرة من خلال التصميم السينمائي." },
    badge: { en: "2022 PLAY", ar: "2022 عرض" },
    ctaPrimary: { en: "Start", ar: "ابدأ" },
    ctaSecondary: { en: "Work", ar: "أعمالي" },
  };

  const marquee = siteContent?.marquee || { logos: [] };

  return (
    <section 
      ref={ref} 
      onPointerMove={handlePointerMove}
      id="hero" 
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      
      {/* Video Background with Parallax & Scroll Scale */}
      <motion.div 
        className="absolute inset-[-10%] w-[120%] h-[120%] z-0 pointer-events-none"
        style={{ x: smoothX, y: smoothY, scale: videoScale, willChange: 'transform' }}
      >
        <video
          key={hero.background?.url || "/hero-bg.mp4"}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover ${lang === 'ar' ? '-scale-x-100' : ''}`}
        >
          <source src={hero.background?.url || "/hero-bg.mp4"} type="video/mp4" />
        </video>
        {/* Lighter overlays for better video details */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Main Content Container */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-24"
      >
        <motion.div
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl"
        >
          {hero?.title && (
             <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white uppercase leading-[1.1]">
                {hero.title[lang]?.split('\n').map((line: string, i: number) => (
                   <span key={i} className="block">{line}</span>
                ))}
             </h1>
          )}

          {hero?.badge?.[lang] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-6 mb-8 mt-2"
            >
               <span className="text-sm md:text-xl font-mono font-bold tracking-[0.2em] uppercase text-white/90 border-b-2 border-white/40 pb-2">
                 {hero.badge[lang]}
               </span>
               <div className="flex gap-2 text-[10px] md:text-xs font-mono text-white/70 tracking-widest">
                  {lang === 'ar' ? (
                     <><span>تصميم</span> • <span>ابداع</span></>
                  ) : (
                     <><span>DESIGN</span> • <span>INNOVATION</span></>
                  )}
               </div>
            </motion.div>
          )}

          {hero?.subtitle?.[lang] && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-sm md:text-lg text-white/80 mb-12 max-w-xl leading-relaxed font-sans font-light"
            >
              {hero.subtitle[lang]}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
              <Button
                variant="primary"
                className="w-full sm:w-auto h-14 md:h-16 px-12 md:px-16 text-xs md:text-sm shadow-[0_0_40px_rgba(var(--accent-rgb),0.5)] hover:shadow-[0_0_60px_rgba(var(--accent-rgb),0.8)] transition-shadow duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {hero?.ctaPrimary?.[lang] || 'Start'}
              </Button>

              <Button
                variant="secondary"
                className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-xs md:text-sm border-white/30 hover:border-white/60 bg-white/10 backdrop-blur-md transition-all duration-300"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {hero?.ctaSecondary?.[lang] || 'Work'}
              </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Marquee at bottom - Subtle */}
      {marquee?.logos && marquee.logos.length > 0 && (
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute bottom-12 w-full overflow-hidden pointer-events-none opacity-30 hover:opacity-60 transition-opacity z-20"
        >
           <div className="flex w-fit animate-marquee grayscale invert gap-24 pr-24">
              {[...marquee.logos, ...marquee.logos, ...marquee.logos].map((logo, i) => (
                <img key={i} src={logo?.image} alt={logo?.name} className="h-4 md:h-6 object-contain shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              ))}
           </div>
           
           <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
              }
              .animate-marquee {
                animation: marquee 40s linear infinite;
              }
           `}</style>
        </motion.div>
      )}
    </section>
  );
};
