import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import type { ServiceItem } from '../../types/admin';


interface ServicesProps {
  lang: Language;
}

const ServiceCard = ({ 
  item, 
  index, 
  lang 
}: { 
  item: ServiceItem; 
  index: number; 
  lang: Language 
}) => {

  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const blurValue = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [15, 0, 0, 15]);
  const opacityValue = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.2, 1, 1, 0.2]);
  const scaleValue = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.92, 1.02, 1.02, 0.92]);
  const borderOpacity = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.03, 0.4, 0.4, 0.03]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        opacity: opacityValue,
        scale: scaleValue,
        filter: useTransform(blurValue, (v) => `blur(${v}px)`),
        position: 'relative'
      }}
      className="relative w-full max-w-5xl mb-32 last:mb-0 group cursor-default"
    >
       {/* Heavy Glass Frosting (Deeper when out of focus) */}
       <motion.div 
         style={{ opacity: useTransform(blurValue, [0, 15], [0, 0.6]) }}
         className="absolute inset-0 bg-white/2 backdrop-blur-md rounded-[50px] z-20 pointer-events-none border border-white/5" 
       />

       <motion.div
          style={{ 
            borderColor: useTransform(borderOpacity, (v) => `rgba(139, 92, 246, ${v})`),
            boxShadow: useTransform(glowOpacity, (v) => `0 40px 120px -20px rgba(139, 92, 246, ${v * 0.15})`)
          }}
          className="relative p-12 md:p-16 rounded-[50px] bg-gh-dark border border-white/5 overflow-hidden transition-all duration-700"
       >
          {/* Internal Content Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

          {/* Number Badge */}
          <div className={`absolute top-12 ${lang === 'ar' ? 'right-12 md:right-16' : 'left-12 md:left-16'} font-mono font-black text-xs tracking-widest text-accent-violet/30`}>
             {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </div>

          <div className={`relative z-10 ${lang === 'ar' ? 'pr-20 md:pr-24' : 'pl-20 md:pl-24'}`}>
             
             {/* Tag/Category Cloud */}
             <motion.div 
               style={{ opacity: useTransform(smoothProgress, [0.35, 0.45], [0, 1]) }}
               className="flex flex-wrap gap-3 mb-10"
             >
                {item.tags?.[lang].split('•').map((tag: string, tid: number) => (
                  <span key={tid} className="px-5 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-[9px] font-mono font-bold text-accent-violet uppercase tracking-widest">
                    {tag.trim()}
                  </span>
                ))}
             </motion.div>

             <h3 className="text-4xl md:text-6xl font-heading font-black mb-10 tracking-tighter uppercase text-white drop-shadow-2xl">
                {item.title[lang]}
             </h3>
             
             <div className="max-w-4xl">
               <p className="text-lg md:text-xl leading-relaxed font-sans mb-10 text-white/50">
                  {item.description[lang]}
               </p>
               
               {/* Detail Interaction Mark */}
               <motion.div 
                 style={{ 
                   scale: glowOpacity,
                   backgroundColor: useTransform(glowOpacity, [0, 1], ["rgba(255,255,255,0.05)", "rgba(139,92,246,1)"]) 
                 }}
                 className="w-3 h-3 rounded-full shadow-[0_0_20px_rgba(139,92,246,1)]" 
               />
             </div>
          </div>

          {/* High-Fidelity Glow Gradient (Directional) */}
          <motion.div 
             style={{ opacity: useTransform(glowOpacity, (v) => v * 0.4) }}
             className="absolute inset-0 bg-radial-[at_top_left] from-accent-violet/20 via-transparent to-transparent pointer-events-none" 
          />

          {/* Edge Aesthetic Line */}
          <div className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-1/4 h-1/2 w-px bg-linear-to-b from-transparent via-accent-violet/40 to-transparent`} />
       </motion.div>
    </motion.div>
  );
};

export const Services = ({ lang }: ServicesProps) => {
  const { siteContent } = useAdmin();
  const { services } = siteContent;

  return (
    <section className="py-72 px-6 md:px-12 bg-transparent relative overflow-hidden">
       {/* Ambient Space Haze */}
       <div className="hidden md:block absolute top-1/4 left-1/4 w-[1000px] h-[1000px] bg-accent-violet/2 rounded-full blur-[300px] pointer-events-none" />
       <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-accent-blue/2 rounded-full blur-[250px] pointer-events-none" />

       <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className={`mb-56 ${lang === 'ar' ? 'pr-8 self-start' : 'pl-8 self-start'}`}>
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="text-[10px] font-mono font-black tracking-[0.6em] text-accent-violet uppercase mb-6"
             >
                Creative Expertise
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-5xl md:text-9xl font-heading font-black mb-8 tracking-tighter uppercase text-white"
             >
                {services.title[lang]}
             </motion.h2>
          </div>

          <div className="w-full flex flex-col items-center space-y-64">
             {services.items.map((item: ServiceItem, index: number) => (

                <ServiceCard 
                  key={index} 
                  item={item} 
                  index={index} 
                  lang={lang} 
                />
             ))}
          </div>
       </div>

       <div className="h-96" />
    </section>
  );
};

