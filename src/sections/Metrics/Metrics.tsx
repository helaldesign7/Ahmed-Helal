import { motion, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import type { MetricItem } from '../../types/admin';


interface MetricsProps {
  lang: Language;
}

const CountUp = ({ value, label }: { value: string; label: string }) => {
  const numericValue = parseInt(value) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  
  const [displayCount, setDisplayCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, numericValue, {
        duration: 3,
        ease: "easeOut",
        onUpdate: (v) => setDisplayCount(Math.floor(v))
      });
      return controls.stop;
    }
  }, [isInView, numericValue]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="text-center group p-12 md:p-16 rounded-[40px] bg-gh-dark/50 backdrop-blur-md border border-white/5 hover:border-accent-violet transition-all duration-700 hover:shadow-[0_20px_100px_rgba(139,92,246,0.1)] relative overflow-hidden"
    >
       <div className="absolute inset-0 bg-linear-to-b from-accent-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

       <div className="text-6xl md:text-8xl font-heading font-black text-white mb-6 relative z-10 tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {displayCount}{suffix}
       </div>
       
       <div className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-mono font-black text-white/20 group-hover:text-accent-violet/60 transition-colors relative z-10">
          {label}
       </div>

       <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
          <motion.div 
             initial={{ x: "-100%" }}
             whileInView={{ x: "0%" }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 3, ease: "easeOut" }}
             className="w-full h-full bg-accent-violet shadow-[0_0_20px_rgba(139,92,246,0.8)]" 
          />
       </div>
    </motion.div>
  );
};

export const Metrics = ({ lang }: MetricsProps) => {
  const { siteContent } = useAdmin();
  const { metrics } = siteContent;

  return (
    <section className="py-64 px-6 md:px-12 bg-transparent relative overflow-hidden">
       {/* Background Atmospheric Flare */}
       <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 rounded-full blur-[250px] pointer-events-none" />

       <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {metrics.items.map((item: MetricItem, index: number) => (

                <CountUp 
                  key={index}
                  value={item.value}
                  label={item.label[lang]}
                />
             ))}
          </div>
       </div>
    </section>
  );
};

