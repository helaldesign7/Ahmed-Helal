import { XCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaBehance, FaDribbble, FaGithub, FaPinterest } from 'react-icons/fa6';
import { useAdmin } from '../../../contexts/useAdmin';

export const SocialLinksManager = ({ onClose, lang = 'en' }: { onClose: () => void, lang?: 'en' | 'ar' }) => {
  const { siteContent, updateSectionArray } = useAdmin();
  const socials = siteContent.socials || [];
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Social Connectivity',
      subtitle: 'Manage public profile nodes',
      platforms: {
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        behance: 'Behance',
        dribbble: 'Dribbble',
        github: 'GitHub',
        email: 'Email address',
        phone: 'Phone Number',
        pinterest: 'Pinterest'
      },
      note: 'CORE SYSTEM: SOCIAL NODES ARE FIXED DEFINITIONS'
    },
    ar: {
      title: 'روابط التواصل',
      subtitle: 'إدارة روابط الملفات الشخصية العامة',
      platforms: {
        whatsapp: 'واتساب',
        instagram: 'إنستجرام',
        linkedin: 'لينكد إن',
        behance: 'بيهانس',
        dribbble: 'دريبل',
        github: 'جيتهاب',
        email: 'عنوان البريد الإلكتروني',
        phone: 'رقم الهاتف',
        pinterest: 'بينتريست'
      },
      note: 'نظام النواة: مسارات التواصل هي تعريفات ثابتة'
    }
  };

  const socialIcons: Record<string, React.ReactNode> = {
    whatsapp: <FaWhatsapp className="w-4 h-4" />,
    instagram: <FaInstagram className="w-4 h-4" />,
    linkedin: <FaLinkedin className="w-4 h-4" />,
    behance: <FaBehance className="w-4 h-4" />,
    dribbble: <FaDribbble className="w-4 h-4" />,
    github: <FaGithub className="w-4 h-4" />,
    pinterest: <FaPinterest className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />
  };

  const updateLink = (id: string, field: 'url' | 'isActive', value: string | boolean) => {
    const newSocials = socials.map(s => s.id === id ? { ...s, [field]: value } : s);
    updateSectionArray('socials', '', newSocials);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] ${isRtl ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between p-6 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-lg font-black tracking-widest uppercase text-white">{t[lang].title}</h2>
            <p className="text-xs font-mono text-white/40 uppercase mt-1">{t[lang].subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {socials.map((link) => (
            <div key={link.id} className={`bg-[#0c0c0c] border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-white/10 transition-colors ${!link.isActive ? 'opacity-50' : ''} ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${link.isActive ? 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet' : 'bg-white/5 border-white/10 text-white/20'}`}>
                {socialIcons[link.platform] || <ExternalLink className="w-4 h-4" />}
              </div>
              
              <div className={`flex-1 space-y-1 ${isRtl ? 'text-right' : ''}`}>
                <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] block">
                  {t[lang].platforms[link.platform as keyof typeof t['en']['platforms']] || link.platform}
                </label>
                <input 
                  type="text" 
                  value={link.url} 
                  dir="ltr"
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  className={`w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-white/5 focus:text-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`} 
                  placeholder={`https://...`} 
                />
              </div>

              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => updateLink(link.id, 'isActive', !link.isActive)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${link.isActive ? 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet' : 'bg-white/5 border-white/10 text-white/20'}`}
                 >
                   <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-accent-violet animate-pulse' : 'bg-white/20'}`} />
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white/2 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] text-center">
          {t[lang].note}
        </div>
      </div>
    </div>
  );
};
