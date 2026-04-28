import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import type { TestimonialItem } from '../../types/admin';
import { Star } from 'lucide-react';

import { cn } from '../../utils/cn';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials = ({ lang }: TestimonialsProps) => {
  const { siteContent } = useAdmin();
  const { testimonials } = siteContent;

  // Duplicate the array to create a seamless infinite loop
  const marqueeItems = [...testimonials.items, ...testimonials.items, ...testimonials.items];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
       <div className="w-full flex flex-col items-center">
          <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-heading font-bold mb-16 text-center px-6 md:px-12"
          >
             {testimonials.title[lang]}
          </motion.h2>

          <div 
             className="relative w-full flex overflow-hidden"
             style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
          >
             {/* The Scrolling Container */}
             <motion.div
               animate={{ x: lang === 'ar' ? ['50%', '0%'] : ['0%', '-50%'] }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex gap-6 md:gap-8 px-4 py-8 items-center shrink-0 w-max"
               style={{ width: "max-content" }}
             >
               {marqueeItems.map((item: TestimonialItem, index: number) => (

                 <div
                   key={index}
                   className={cn(
                     "relative p-8 md:p-10 rounded-4xl w-[350px] md:w-[450px] shrink-0",
                     "bg-gh-dark/40 backdrop-blur-lg border border-white/5",
                     "transition-all duration-500 hover:bg-gh-dark/60 hover:border-accent-violet/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]",
                     lang === 'ar' ? 'rtl text-right' : 'ltr text-left'
                   )}
                 >
                   {/* Stars Rating */}
                   <div className="flex gap-1 mb-6">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                     ))}
                   </div>
                   
                   {/* Large Quote Mark Background */}
                   <div className={cn(
                       "absolute top-6 text-8xl font-serif text-white/5 select-none pointer-events-none",
                       lang === 'ar' ? 'left-6' : 'right-6'
                   )}>
                     “
                   </div>

                   <p className="text-lg md:text-xl font-medium leading-relaxed text-white/80! mb-8 relative z-10 min-h-[120px]">
                      "{item.quote[lang]}"
                   </p>
                   
                   {/* User Info */}
                   <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                      <div className="relative">
                        <img src={item.avatar} alt={item.name[lang]} className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gh-dark"></div>
                      </div>
                      <div>
                         <h4 className="font-bold text-lg text-white">{item.name[lang]}</h4>
                         <p className="text-xs font-mono uppercase tracking-wider text-accent-violet/80 mt-1">{item.role[lang]} @ <span className="text-white/60">{item.company[lang]}</span></p>
                      </div>
                   </div>
                 </div>
               ))}
             </motion.div>
          </div>
       </div>
    </section>
  );
};

