import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { useAuth } from '../../contexts/AuthContext';

interface AIAssistantProps {
  lang: 'en' | 'ar';
}

export const AIAssistant = ({ lang }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const isRtl = lang === 'ar';

  const t = {
    en: 'Ask AURA AI',
    ar: 'اسأل أورا الذكية'
  };

  return (
    <>
      <div className="fixed bottom-4 md:bottom-10 right-4 md:right-10 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent-violet flex items-center justify-center text-white shadow-[0_20px_50px_rgba(139,92,246,0.5)] cursor-pointer group transition-all duration-500 overflow-visible"
        >
          <div className="absolute inset-0 bg-accent-violet rounded-full animate-pulse opacity-40 blur-xl scale-125 -z-10" />
          <div className="absolute inset-0 bg-accent-violet rounded-full animate-ping opacity-20 -z-10" />

          <Sparkles className="w-6 h-6 md:w-8 md:h-8 relative z-10 transition-transform group-hover:scale-125" />

          <div
            className="absolute right-full mr-4 md:mr-6 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none transform group-hover:translate-y-[-50%] shadow-2xl"
          >
            <span
              className={`text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase text-accent-violet ${
                isRtl ? 'font-arabic' : 'font-mono'
              }`}
            >
              {t[lang]}
            </span>

            <div
              className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white/5 rotate-45 border-l border-b border-white/10 z-[-1] lg:block hidden"
            />
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && <ChatPanel key={user?.id || 'guest'} lang={lang} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};