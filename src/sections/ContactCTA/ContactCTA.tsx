import { motion } from 'framer-motion';
import { MessageCircle, Mail } from 'lucide-react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import { Button } from '../../components/common/Button';

interface ContactCTAProps {
  lang: Language;
  id?: string;
}

export const ContactCTA = ({ lang, id }: ContactCTAProps) => {
  const { siteContent } = useAdmin();
  const { contact, socials } = siteContent;

  return (
    <section id={id} className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden">
       {/* Background Impact Glow */}
       <div className="hidden md:block absolute inset-x-0 bottom-0 h-1/2 bg-accent-violet/10 blur-[150px] rounded-full translate-y-1/2" />

       <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="text-5xl md:text-8xl font-heading font-black mb-8 tracking-tighter text-white"
          >
             {contact.title[lang]}
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-white/40 mb-12"
          >
             {contact.subtitle[lang]}
          </motion.p>

     <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:row items-center justify-center gap-6"
     >
        <Button 
           variant="whatsapp" 
           className="w-full sm:w-auto h-16 text-lg flex items-center justify-center gap-3 px-12"
           onClick={() => {
              const wa = socials.find(s => s.platform === 'whatsapp')?.url;
              if (wa) window.open(wa, '_blank');
           }}
        >
           <MessageCircle className="w-6 h-6 fill-white" />
           {contact.whatsappLabel[lang]}
        </Button>
        <Button 
           variant="secondary" 
           className="w-full sm:w-auto h-16 text-lg flex items-center justify-center gap-3 px-10 border-white/20 hover:border-white/40"
           onClick={() => {
              const mail = socials.find(s => s.platform === 'email')?.url;
              const cleanMail = mail?.replace('mailto:', '');
              if (cleanMail) window.open(`mailto:${cleanMail}`, '_blank');
           }}
        >
           <Mail className="w-5 h-5 opacity-60" />
           {contact.emailLabel[lang]}
        </Button>
     </motion.div>
       </div>
    </section>
  );
};

