import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import type { ProcessStep as ProcessStepData } from '../../types/admin';


interface ProcessProps {
  lang: Language;
  id?: string;
}

const ProcessStep = ({ 
  step, 
  index, 
  lang 
}: { 
  step: ProcessStepData; 
  index: number; 
  lang: Language; 
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="flex gap-8 md:gap-12 group relative"
    >
      {/* Node & Repulsion Container */}
      <div className="relative shrink-0 pt-2">
        <motion.div 
          whileHover={{ 
            scale: 1.3,
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
            x: [0, -10, 10, -5, 5, 0], // Subtle repulsion jitter
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-10 h-10 rounded-full bg-gh-dark border-2 border-white/10 flex items-center justify-center cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.1)] group-hover:border-accent-violet transition-colors"
        >
          {/* Inner Glowing Core */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-accent-violet shadow-[0_0_15px_rgba(139,92,246,1)]"
          />
        </motion.div>
        
        {/* Ambient Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent-violet/5 rounded-full blur-xl group-hover:bg-accent-violet/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="pb-24">
        <div className="mb-4">
           <span className="text-accent-violet font-mono text-sm font-black tracking-widest uppercase">
             {step.number}
           </span>
        </div>
        <motion.h3 
          whileHover={{ x: 10, color: "#fff" }}
          className="text-3xl md:text-5xl font-heading font-black mb-6 tracking-tight text-white/80 transition-colors cursor-default"
        >
           {step.title[lang]}
        </motion.h3>
        <p className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed font-sans font-light">
           {step.description[lang]}
        </p>
      </div>
    </motion.div>
  );
};

export const Process = ({ lang, id }: ProcessProps) => {
  const { siteContent } = useAdmin();
  const { process } = siteContent;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scrollLineHeight = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const lineHeight = useTransform(scrollLineHeight, [0, 1], ["0%", "100%"]);

  return (
    <section id={id} ref={containerRef} className="py-32 px-6 md:px-12 bg-transparent relative overflow-hidden">
       {/* Background Noise/Gradient */}
       <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-accent-violet/5 to-transparent pointer-events-none" />

       <div className="max-w-5xl mx-auto">
          <div className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-accent-violet mb-6"
            >
              Strategic Mapping
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-black mb-8 tracking-tighter uppercase text-white"
            >
              {process.title[lang]}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/30 text-lg md:text-xl max-w-2xl font-sans"
            >
              {process.subtitle[lang]}
            </motion.p>
          </div>

          <div className={`relative ${lang === 'ar' ? 'pr-5 md:pr-0' : 'pl-5 md:pl-0'}`}>
             {/* The Vertical Progression Line */}
             <div className={`absolute ${lang === 'ar' ? 'right-[19px] md:right-[19px]' : 'left-[19px] md:left-[19px]'} top-4 bottom-4 w-px bg-white/10 overflow-hidden`}>
                <motion.div 
                   style={{ height: lineHeight }}
                   className="w-full bg-accent-violet shadow-[0_0_20px_rgba(139,92,246,0.8)]"
                />
             </div>
             
             {/* Process Steps */}
             <div className="space-y-4">
                {process.steps.map((step: ProcessStepData, index: number) => (
                  <ProcessStep key={index} step={step} index={index} lang={lang} />
                ))}
             </div>

          </div>
       </div>

       {/* Decorative Bottom Flare */}
       <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

