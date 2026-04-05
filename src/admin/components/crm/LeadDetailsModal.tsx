import { motion } from 'framer-motion';
import { X, Mail, Phone, Building2, Calendar, DollarSign, MessageSquare, ExternalLink, ShieldCheck, Zap, Globe, FileText, User } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { Lead } from '../../../types/admin';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDetailsModal = ({ lead, onClose }: LeadDetailsModalProps) => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Entity Manifest',
      subtitle: `LD_${lead.id} • ${lead.source} Matrix`,
      clientInfo: 'Client Identity',
      projectScope: 'Project Objective',
      financials: 'Resource Allocation',
      contact: 'Communication Route',
      meta: 'Transmission Data',
      fields: {
        name: 'Identifier',
        email: 'Primary Channel',
        whatsapp: 'WhatsApp Matrix',
        company: 'Corporate Entity',
        interest: 'Domain Focus',
        service: 'Execution Type',
        budget: 'Budget Threshold',
        contactPref: 'Preferred Contact Method',
        date: 'Signal Logged',
        description: 'Detailed Transmissions'
      },
      actions: {
        reply: 'Initialize Response',
        archive: 'Store in Archive',
        close: 'Terminate Display'
      }
    },
    ar: {
      title: 'بيان الطلب',
      subtitle: `LD_${lead.id} • مصدر المصفوفة: ${lead.source}`,
      clientInfo: 'هوية العميل',
      projectScope: 'أهداف المشروع',
      financials: 'بيانات الميزانية',
      contact: 'طرق الاتصال',
      meta: 'بيانات الرفع',
      fields: {
        name: 'اسم الهوية',
        email: 'القناة الرئيسية',
        whatsapp: 'الاتصال (واتساب)',
        company: 'الجهة / الشركة',
        interest: 'مجال الاهتمام',
        service: 'نوع التنفيذ',
        budget: 'نطاق الميزانية',
        contactPref: 'وسيلة الاتصال المفضلة',
        date: 'توقيت الإشارة',
        description: 'وصف الطلب التفصيلي'
      },
      actions: {
        reply: 'بدء الرد',
        archive: 'تخزين في الأرشيف',
        close: 'إغلاق الواجهة'
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className={`relative w-full max-w-4xl max-h-[92vh] bg-primary-black border border-white/10 rounded-4xl shadow-2xl flex flex-col overflow-hidden ${isRtl ? 'text-right' : ''}`}
      >
        {/* Header */}
        <div className={`p-10 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent shrink-0 flex items-center justify-between`}>
          <div>
            <div className={`flex items-center gap-3 mb-2`}>
              <ShieldCheck className="w-5 h-5 text-accent-violet" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">{t[lang].title}</h2>
            </div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">{t[lang].subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 text-white/30 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Identity & Contact */}
            <div className="space-y-10">
               {/* Client Info */}
               <section className="space-y-6">
                 <div className={`flex items-center gap-2 pb-2 border-b border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4 text-accent-violet" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].clientInfo}</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                       <label className={`text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1 ${isRtl ? 'text-right' : ''}`}>{t[lang].fields.name}</label>
                       <div className="text-base font-black text-white">{lead.name}</div>
                    </div>
                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                       <label className={`text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1 ${isRtl ? 'text-right' : ''}`}>{t[lang].fields.company}</label>
                       <div className={`text-sm text-white/80 flex items-center gap-2`}>
                         <Building2 className="w-4 h-4 opacity-40 shrink-0" />
                         {lead.company || (isRtl ? 'جهة خاصة' : 'Private Entity')}
                       </div>
                    </div>
                 </div>
               </section>

               {/* Contact Matrix */}
               <section className="space-y-6">
                 <div className={`flex items-center gap-2 pb-2 border-b border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Zap className="w-4 h-4 text-accent-violet" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].contact}</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div className={`flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-accent-violet/30 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}>
                       <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent-violet/10 transition-colors">
                          <Mail className="w-4 h-4 text-white/40 group-hover:text-accent-violet transition-colors" />
                       </div>
                       <div className={isRtl ? 'text-right' : ''}>
                          <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-0.5">{t[lang].fields.email}</label>
                          <div className="text-xs font-mono text-white/60">{lead.email}</div>
                       </div>
                    </div>
                    {lead.whatsapp && (
                       <div className={`flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-accent-violet/30 transition-colors`}>
                          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent-violet/10 transition-colors">
                             <Phone className="w-4 h-4 text-white/40 group-hover:text-accent-violet transition-colors" />
                          </div>
                          <div className={isRtl ? 'text-right' : ''}>
                             <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-0.5">{t[lang].fields.whatsapp}</label>
                             <div className="text-xs font-mono text-white/60">{lead.whatsapp}</div>
                          </div>
                       </div>
                    )}
                 </div>
               </section>
            </div>

            {/* Right Column: Project & Details */}
            <div className="space-y-10">
               {/* Project Details */}
               <section className="space-y-6">
                 <div className={`flex items-center gap-2 pb-2 border-b border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Globe className="w-4 h-4 text-accent-violet" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].projectScope}</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                          <label className={`text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1 ${isRtl ? 'text-right' : ''}`}>{t[lang].fields.interest}</label>
                          <div className="text-sm font-black text-white uppercase">{lead.interest}</div>
                       </div>
                       <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                          <label className={`text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1 ${isRtl ? 'text-right' : ''}`}>{t[lang].fields.service}</label>
                          <div className="text-sm font-black text-white uppercase">{lead.serviceType || 'Standard'}</div>
                       </div>
                    </div>
                    <div className="p-6 bg-black border border-white/5 rounded-4xl">
                       <div className={`flex items-center gap-2 mb-4 opacity-40 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-mono uppercase tracking-widest">{t[lang].fields.description}</span>
                       </div>
                       <p className={`text-sm leading-relaxed text-white/60 font-mono ${isRtl ? 'text-right' : ''}`}>
                         {lead.description}
                       </p>
                    </div>
                 </div>
               </section>

               {/* Economics & Meta */}
               <section className="space-y-6">
                  <div className={`flex items-center gap-2 pb-2 border-b border-white/10`}>
                    <DollarSign className="w-4 h-4 text-accent-violet" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].financials}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className={`flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accent-violet" />
                      </div>
                      <div className={isRtl ? 'text-right' : ''}>
                        <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block">{t[lang].fields.budget}</label>
                        <div className="text-lg font-black text-white">{lead.budget || '—'}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4`}>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white/40" />
                      </div>
                      <div className={isRtl ? 'text-right' : ''}>
                        <label className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] block">{t[lang].fields.date}</label>
                        <div className="text-xs text-white/60">{lead.date}</div>
                      </div>
                    </div>
                  </div>
               </section>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-10 border-t border-white/5 bg-primary-black shrink-0 flex items-center justify-end gap-6`}>
           <button 
             onClick={onClose}
             className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
           >
             {t[lang].actions.close}
           </button>
           <button className={`flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white px-8 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest`}>
              <FileText className="w-4 h-4" />
              {t[lang].actions.archive}
           </button>
           <button className={`flex items-center gap-3 bg-white text-black hover:bg-accent-violet hover:text-white px-10 py-4 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-accent-violet/20 font-black text-[10px] uppercase tracking-widest`}>
              <ExternalLink className="w-4 h-4" />
              {t[lang].actions.reply}
           </button>
        </div>
      </motion.div>
    </div>
  );
};
