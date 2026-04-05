import { motion } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';

interface HeroProps {
  lang: Language;
}

const FloatingTag = ({ word, index }: { word: string; index: number }) => {
  const positions = [
    { x: -450, y: -200, r: -5 },
    { x: 480, y: -150, r: 8 },
    { x: -400, y: 150, r: -12 },
    { x: 500, y: 250, r: 15 },
    { x: -150, y: -300, r: 3 },
    { x: 250, y: -280, r: -6 },
    { x: -500, y: 0, r: 10 },
    { x: 550, y: 50, r: -10 },
    { x: -100, y: 350, r: 5 },
    { x: 100, y: -350, r: -5 },
    { x: -350, y: -100, r: 20 },
    { x: 350, y: 100, r: -20 },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.1, 0.4, 0.1],
        x: [pos.x, pos.x + 15, pos.x - 15, pos.x],
        y: [pos.y, pos.y - 20, pos.y + 20, pos.y],
        rotate: [pos.r, pos.r + 3, pos.r - 3, pos.r]
      }}
      transition={{ 
        duration: 10 + index, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      whileHover={{ 
        scale: 1.1, 
        opacity: 1,
        boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
        backgroundColor: "rgba(255, 255, 255, 0.1)"
      }}
      className="absolute z-10 hidden md:flex items-center px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md cursor-default pointer-events-auto shadow-2xl"
    >
      <div className="w-1 h-1 rounded-full bg-accent-violet mr-2 shadow-[0_0_10px_rgba(139,92,246,1)]" />
      <span className="text-[9px] font-mono font-black text-white/30 tracking-widest uppercase truncate">{word}</span>
    </motion.div>
  );
};

const FloatingShape = ({ index }: { index: number }) => {
  const shapes = [
    "w-2 h-2 rounded-full",
    "w-3 h-[1px] rotate-45",
    "w-1 h-4",
    "w-2 h-2 rotate-45 border border-white/20",
    "w-2 h-2 rounded-full ring-1 ring-white/10"
  ];
  
  const shapeClass = shapes[index % shapes.length];
  const driftPaths = [
    { x: [-100, 200], y: [-50, 150] },
    { x: [300, -100], y: [100, -200] },
    { x: [-400, 50], y: [300, 50] },
    { x: [200, 400], y: [-300, 100] },
    { x: [-50, -350], y: [400, -50] },
    { x: [450, 50], y: [-150, 300] },
  ];

  const path = driftPaths[index % driftPaths.length];
  
  return (
    <motion.div 
       animate={{ 
         x: path.x,
         y: path.y,
         opacity: [0.1, 0.3, 0.1]
       }}
       transition={{ duration: 25 + index * 5, repeat: Infinity, ease: "linear" }}
       className={`absolute bg-accent-violet/20 blur-[1px] ${shapeClass}`} 
    />
  );
};

export const Hero = ({ lang }: HeroProps) => {
  const { siteContent } = useAdmin();
  const { hero, marquee } = siteContent;

  // Gooey/Viscous transition config
  const springConfig = { type: "spring", stiffness: 150, damping: 20, mass: 1.2 } as const;

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-transparent">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: [1.05, 1.15, 1.05] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black" />
        
        <motion.div 
           animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-accent-violet/10 rounded-full blur-[200px]" 
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
         <div className="relative w-full max-w-7xl h-full">
            {hero.floatingKeywords.map((item: { [key in Language]: string }, i: number) => (
              <FloatingTag key={i} word={item[lang]} index={i} />
            ))}
            {[...Array(15)].map((_, i) => (
              <FloatingShape key={i} index={i} />
            ))}
         </div>
      </div>


      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springConfig}
        className="relative z-20 text-center max-w-5xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
             <div className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-[0_0_10px_rgba(139,92,246,1)] animate-pulse" />
             <span className="text-[10px] md:text-xs font-mono font-black tracking-[0.4em] uppercase text-white/40">
               {hero.badge[lang]}
             </span>
          </div>
        </motion.div>

        <motion.h1 
          whileHover={{ scale: 1.02 }}
          transition={springConfig}
          className="text-7xl md:text-[140px] font-heading font-black mb-8 tracking-tighter text-white uppercase leading-[0.85] select-none"
        >
          {hero.title[lang]}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-lg md:text-2xl text-white/30 mb-20 max-w-3xl mx-auto leading-relaxed font-sans font-light"
        >
          {hero.subtitle[lang]}
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-8">
            <Button
              variant="primary"
              className="w-full sm:w-auto h-20 px-24 text-[12px] shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:shadow-[0_0_80px_rgba(139,92,246,0.5)]"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.ctaPrimary[lang]}
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto h-20 px-16 text-[12px] border-white/10 hover:border-white/30"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.ctaSecondary[lang]}
            </Button>
        </div>
      </motion.div>

      {/* Corporate Marquee (Permanent Motion Loop) */}
      <div className="absolute bottom-16 w-full overflow-hidden pointer-events-none opacity-20 hover:opacity-50 transition-opacity">
         <div className="flex w-fit animate-marquee grayscale invert gap-24 pr-24">
            {[...marquee.logos, ...marquee.logos, ...marquee.logos].map((logo, i) => (
              <img key={i} src={logo.image} alt={logo.name} className="h-4 md:h-6 object-contain shrink-0" />
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
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};
