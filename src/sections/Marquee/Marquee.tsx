import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';


import type { MarqueeLogo } from '../../types/admin';


export const Marquee = () => {

  const { siteContent } = useAdmin();

  const { marquee } = siteContent;

  return (
    <section className="py-12 bg-gh-dark/50 border-y border-white/5 overflow-hidden">
      <div className="flex overflow-hidden">
        <motion.div
           animate={{ x: ['0%', '-50%'] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="flex items-center w-max"
        >
          {/* Duplicate the array many times to ensure enough width for -50% translation */}
          {[...marquee.logos, ...marquee.logos, ...marquee.logos, ...marquee.logos, ...marquee.logos, ...marquee.logos, ...marquee.logos, ...marquee.logos].map((logo: MarqueeLogo, index: number) => (
             <div key={index} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500 px-8 md:px-16">
               <img src={logo.image} alt={logo.name} className="h-8 md:h-10 grayscale brightness-200" />
               <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-white/50">{logo.name}</span>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

