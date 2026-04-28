import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useAdmin } from '../../contexts/useAdmin';
import type { Language } from '../../data/content';
import { 
  Rocket, User, Mail, MessageSquare, Briefcase, 
  Clock, DollarSign, CheckCircle2,
  Target, ShieldCheck, Phone, ChevronRight
} from 'lucide-react';

interface StartProjectProps {
  lang: Language;
}

export const StartProject = ({ lang }: StartProjectProps) => {
  const { siteContent } = useAdmin();
  const content = siteContent.startProject;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    serviceType: 'Brand Identity',
    projectTitle: '',
    description: '',
    budget: '$500–1000',
    timeline: '2–4 weeks',
    preferredContact: 'email' as const,
    hasIdentity: 'No',
    workType: 'One-time'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const guestSessionId = localStorage.getItem('aura_guest_session_id') || '';
      
      const response = await fetch('/.netlify/functions/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          session_id: guestSessionId,
          timestamp: new Date().toISOString() 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Backend processing failed');
      }

      // Backend database save is confirmed
      setIsSubmitting(false);
      setIsSuccess(true);
      
      if (!result.emailSent) {
        console.warn('Lead captured perfectly, but email delivery was delayed.');
      }
      
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMsg = error instanceof Error ? error.message : 'Unknown sync error';
      alert(`TRANSMISSION ERROR: ${errorMsg}`);
    }
  };

  const isRtl = lang === 'ar';

  return (
    <section 
      ref={sectionRef}
      id="start-project" 
      className={`min-h-[100dvh] py-32 px-6 relative bg-primary-black overflow-hidden flex items-center ${isRtl ? 'rtl font-arabic text-right' : 'ltr'}`}
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-violet/10 blur-[200px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-violet/5 blur-[200px] -z-10" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form-container"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start"
            >
              {/* Left Column: Context */}
              <div className="lg:col-span-2 space-y-12 lg:sticky lg:top-32">
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className={`inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <Rocket className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{content.title[lang]}</span>
                  </motion.div>
                  
                  <h2 className="text-6xl md:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter italic">
                    {content.subtitle[lang]}
                  </h2>
                  
                  <p className="text-white/40 text-lg leading-relaxed max-w-md">
                    {content.introCopy[lang]}
                  </p>
                </div>

                <div className="space-y-6">
                   {[
                     { icon: Target, label: isRtl ? 'معايير النخبة' : 'Elite Standard', desc: isRtl ? 'يتم التعامل مع كل مشروع بدقة سينمائية ومعايير عالمية.' : 'Every project is handled with global industry benchmarks and cinematic precision.' },
                     { icon: ShieldCheck, label: isRtl ? 'اتصال مباشر' : 'Direct Pipeline', desc: isRtl ? 'لا وسطاء. ستتواصل مباشرة مع المصمم الرئيسي لمشروعك.' : 'No agencies, no middle-men. You communicate directly with the lead designer.' }
                   ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-5 p-6 rounded-4xl bg-white/2 border border-white/5 backdrop-blur-xl group hover:bg-white/5 transition-all duration-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                       <div className="w-14 h-14 rounded-2xl bg-accent-violet/10 flex items-center justify-center shrink-0 border border-accent-violet/20 group-hover:bg-accent-violet group-hover:text-white transition-all duration-500 shadow-xl shadow-accent-violet/5">
                         <item.icon className="w-6 h-6 text-accent-violet group-hover:text-white" />
                       </div>
                       <div className={isRtl ? 'text-right' : ''}>
                          <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">{item.label}</h4>
                          <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                   ))}
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-3">
                <div className="p-8 md:p-14 rounded-[3rem] bg-[#0A0A0A]/40 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden backdrop-blur-lg">
                  {/* Glassmorphism Accents */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-accent-violet/5 blur-3xl -z-10" />
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-violet/5 blur-3xl -z-10" />

                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Identity Block */}
                    <div className="space-y-8">
                       <h3 className={`text-white/20 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <span>{isRtl ? 'بيانات الهوية' : 'Identity Block'}</span>
                         <div className="h-px flex-1 bg-white/5" />
                       </h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                            </label>
                            <div className="relative group">
                              <User className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                              <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                                placeholder={isRtl ? 'أحمد علي...' : 'John Doe...'}
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
                            </label>
                            <div className="relative group">
                              <Mail className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                              <input 
                                required
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                                placeholder="name@domain.com"
                              />
                            </div>
                          </div>
                       </div>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'رقم الواتساب *' : 'WhatsApp Number *'}
                            </label>
                            <div className="relative group">
                              <Phone className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                              <input 
                                required
                                type="text" 
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                                placeholder="+20 --- ----"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'اسم الشركة / العلامة' : 'Company / Brand Name'}
                            </label>
                            <div className="relative group">
                              <Briefcase className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                              <input 
                                type="text" 
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                                placeholder={isRtl ? 'اسم نشاطك...' : 'Brand Agency...'}
                              />
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Project Parameters */}
                    <div className="space-y-8">
                       <h3 className={`text-white/20 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <span>{isRtl ? 'نوعية المشروع' : 'Project Parameters'}</span>
                         <div className="h-px flex-1 bg-white/5" />
                       </h3>
                       
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'نوع الخدمة *' : 'Service Required *'}
                            </label>
                            <select 
                              value={formData.serviceType}
                              onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                              className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs appearance-none cursor-pointer ${isRtl ? 'text-right' : ''}`}
                            >
                              <option className="bg-[#0c0c0c]" value="Brand Identity">{isRtl ? 'هوية بصرية' : 'Brand Identity'}</option>
                              <option className="bg-[#0c0c0c]" value="Sports Design">{isRtl ? 'تصميم رياضي' : 'Sports Design'}</option>
                              <option className="bg-[#0c0c0c]" value="Social Media Design">{isRtl ? 'تصاميم سوشيال ميديا' : 'Social Media Design'}</option>
                              <option className="bg-[#0c0c0c]" value="Website Design">{isRtl ? 'تصميم مواقع' : 'Website Design'}</option>
                              <option className="bg-[#0c0c0c]" value="Creative Direction">{isRtl ? 'إشراف إبداعي' : 'Creative Direction'}</option>
                              <option className="bg-[#0c0c0c]" value="Other">{isRtl ? 'أخرى' : 'Other'}</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'عنوان المشروع' : 'Project Title'}
                            </label>
                            <input 
                              type="text" 
                              value={formData.projectTitle}
                              onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                              className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs ${isRtl ? 'text-right' : ''}`}
                              placeholder={isRtl ? 'مثال: حملة صيف ٢٠٢٦' : 'e.g., Summer 2026 Campaign'}
                            />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                            {isRtl ? 'توصيف المشروع / الهوية *' : 'Project Brief / Analysis *'}
                          </label>
                          <div className="relative group">
                            <MessageSquare className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-5 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-all`} />
                            <textarea 
                              required
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                              rows={6}
                              className={`w-full bg-white/5 border border-white/10 rounded-4xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs resize-none leading-relaxed ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                              placeholder={isRtl ? 'أخبرني عن رؤيتك، أهدافك، وأي متطلبات خاصة...' : 'Analyze your vision, specific goals, and architectural requirements...'}
                            />
                          </div>
                       </div>
                    </div>

                    {/* Economics & Schedule */}
                    <div className="space-y-8">
                       <h3 className={`text-white/20 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                         <span>{isRtl ? 'الميزانية والوقت' : 'Economics & Schedule'}</span>
                         <div className="h-px flex-1 bg-white/5" />
                       </h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'المدة الزمنية' : 'Timeline'}
                            </label>
                            <div className="relative group">
                              <Clock className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-all`} />
                              <select 
                                value={formData.timeline}
                                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs appearance-none cursor-pointer ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                              >
                                <option className="bg-[#0c0c0c]" value="Urgent">{isRtl ? 'عاجل جداً' : 'Urgent'}</option>
                                <option className="bg-[#0c0c0c]" value="1 week">{isRtl ? 'أسبوع واحد' : '1 week'}</option>
                                <option className="bg-[#0c0c0c]" value="2–4 weeks">{isRtl ? '٢ - ٤ أسابيع' : '2–4 weeks'}</option>
                                <option className="bg-[#0c0c0c]" value="Flexible">{isRtl ? 'مرن / غير محدد' : 'Flexible'}</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className={`text-white/40 text-[9px] uppercase font-black tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>
                              {isRtl ? 'نطاق الميزانية *' : 'Budget Range *'}
                            </label>
                            <div className="relative group">
                              <DollarSign className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-all`} />
                              <select 
                                required
                                value={formData.budget}
                                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 focus:outline-none focus:border-accent-violet/50 text-white transition-all font-mono text-xs appearance-none cursor-pointer ${isRtl ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                              >
                                <option className="bg-[#0c0c0c]" value="Under $100">{isRtl ? 'أقل من ١٠٠$' : 'Under $100'}</option>
                                <option className="bg-[#0c0c0c]" value="$200–500">$200–500</option>
                                <option className="bg-[#0c0c0c]" value="$500–1000">$500–1000</option>
                                <option className="bg-[#0c0c0c]" value="$1000+">$1000+</option>
                                <option className="bg-[#0c0c0c]" value="Flexible">{isRtl ? 'مرن / قابل للتفاوض' : 'Flexible / Discuss'}</option>
                              </select>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Submission */}
                    <div className="pt-10 flex flex-col items-center space-y-8">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full relative group h-18 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 shadow-3xl shadow-white/5 hover:shadow-accent-violet/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-3 border-black/10 border-t-black rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>{content.submitLabel[lang]}</span>
                              <ChevronRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                            </>
                          )}
                        </motion.button>
                        
                        <div className={`flex items-center gap-3 text-white/20 font-mono text-[8px] uppercase tracking-[0.2em] ${isRtl ? 'flex-row-reverse' : ''}`}>
                           <ShieldCheck className="w-3 h-3 text-accent-violet/50" />
                           {isRtl ? 'اتصال آمن ومحمي عبر نظام هلال-OS' : 'Secure Transmission via HELLA-OS Pipeline'}
                        </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl w-full text-center space-y-10 mx-auto py-32"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-[2.5rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <div className="absolute inset-0 bg-green-500/10 blur-[60px] -z-10 rounded-full" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
                  {content.successMessage[lang]}
                </h2>
                <div className="h-0.5 w-16 bg-accent-violet mx-auto" />
              </div>
              
              <p className="text-white/40 font-mono uppercase tracking-[0.2em] text-xs leading-loose max-w-sm mx-auto">
                {isRtl 
                  ? 'سأقوم بمراجعة طلبك والرد عليك في غضون ٢٤-٤٨ ساعة القادمة. شكراً لاهتمامك.' 
                  : 'Ahmed will analyze your request and initiate contact within the next 24-48 hours.'}
              </p>
              
              <button 
                onClick={() => setIsSuccess(false)}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500"
              >
                {isRtl ? 'إرسال طلب آخر' : 'Initiate New Inquiry'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
