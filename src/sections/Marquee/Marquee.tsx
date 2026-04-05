import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';


import type { MarqueeLogo } from '../../types/admin';


export const Marquee = () => {

  const { siteContent } = useAdmin();

  const { marquee } = siteContent;

  return (
    <section className="py-12 bg-gh-dark/50 border-y border-white/5 overflow-hidden">
      <div className="flex items-center gap-12 whitespace-nowrap">
        <motion.div
           animate={{ x: [0, -1000] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="flex items-center gap-24 shrink-0"
        >
          {marquee.logos.concat(marquee.logos).concat(marquee.logos).map((logo: MarqueeLogo, index: number) => (

             <div key={index} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
               <img src={logo.image} alt={logo.name} className="h-8 md:h-10 grayscale brightness-200" />
               <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-white/50">{logo.name}</span>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

