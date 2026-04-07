import { XCircle, Mail, Phone, ExternalLink, Plus, Trash2, Globe } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaBehance, FaDribbble, FaGithub, FaPinterest, FaFacebook, FaTwitter, FaSnapchat, FaTiktok, FaYoutube } from 'react-icons/fa6';
import { useAdmin } from '../../../contexts/useAdmin';
import { useState } from 'react';

export const SocialLinksManager = ({ onClose, lang = 'en' }: { onClose: () => void, lang?: 'en' | 'ar' }) => {
  const { siteContent, updateSectionArray } = useAdmin();
  const socials = siteContent.socials || [];
  const isRtl = lang === 'ar';
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ platform: 'whatsapp', url: '' });

  const t = {
    en: {
      title: 'Social Connectivity',
      subtitle: 'Manage public profile nodes',
      addBtn: 'Add New Node',
      platforms: {
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        behance: 'Behance',
        dribbble: 'Dribbble',
        github: 'GitHub',
        email: 'Email address',
        phone: 'Phone Number',
        pinterest: 'Pinterest',
        facebook: 'Facebook',
        twitter: 'Twitter/X',
        snapchat: 'Snapchat',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        website: 'Portfolio/Website',
        custom: 'Custom Link'
      },
      placeholders: {
        url: 'https://...',
        platform: 'Platform name...'
      },
      actions: {
        save: 'Save Node',
        cancel: 'Cancel'
      },
      note: 'DYNAMIC SYSTEM: ALL NODES ARE DEPLOYABLE'
    },
    ar: {
      title: 'روابط التواصل',
      subtitle: 'إدارة روابط الملفات الشخصية العامة',
      addBtn: 'إضافة رابط جديد',
      platforms: {
        whatsapp: 'واتساب',
        instagram: 'إنستجرام',
        linkedin: 'لينكد إن',
        behance: 'بيهانس',
        dribbble: 'دريبل',
        github: 'جيتهاب',
        email: 'عنوان البريد الإلكتروني',
        phone: 'رقم الهاتف',
        pinterest: 'بينتريست',
        facebook: 'فيسبوك',
        twitter: 'تويتر/X',
        snapchat: 'سناب شات',
        tiktok: 'تيك توك',
        youtube: 'يوتيوب',
        website: 'موقع إلكتروني',
        custom: 'رابط مخصص'
      },
      placeholders: {
        url: 'رابط الموقع: https://...',
        platform: 'اسم المنصة...'
      },
      actions: {
        save: 'حفظ الرابط',
        cancel: 'إلغاء'
      },
      note: 'نظام ديناميكي: كافة المسارات قابلة للتعديل'
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
    facebook: <FaFacebook className="w-4 h-4" />,
    twitter: <FaTwitter className="w-4 h-4" />,
    snapchat: <FaSnapchat className="w-4 h-4" />,
    tiktok: <FaTiktok className="w-4 h-4" />,
    youtube: <FaYoutube className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />
  };

  const updateLink = (id: string, field: 'url' | 'isActive' | 'platform', value: string | boolean) => {
    const newSocials = socials.map(s => s.id === id ? { ...s, [field]: value } : s);
    updateSectionArray('socials', '', newSocials);
  };

  const deleteLink = (id: string) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الرابط؟' : 'Are you sure you want to delete this link?')) return;
    const newSocials = socials.filter(s => s.id !== id);
    updateSectionArray('socials', '', newSocials);
  };

  const addNewLink = () => {
    if (!newLink.url) return;
    const id = Date.now().toString();
    const newNode = {
      id,
      platform: newLink.platform,
      url: newLink.url,
      isActive: true
    };
    updateSectionArray('socials', '', [...socials, newNode]);
    setNewLink({ platform: 'whatsapp', url: '' });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] ${isRtl ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between p-6 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-lg font-black tracking-widest uppercase text-white">{t[lang].title}</h2>
            <p className="text-xs font-mono text-white/40 uppercase mt-1">{t[lang].subtitle}</p>
          </div>
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-violet hover:bg-accent-violet/80 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
             >
                <Plus className="w-3 h-3" /> {t[lang].addBtn}
             </button>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {showAddForm && (
            <div className="bg-accent-violet/5 border border-accent-violet/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-mono text-accent-violet uppercase tracking-widest">{t[lang].placeholders.platform}</label>
                     <select 
                       value={newLink.platform}
                       onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                       className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50 ${isRtl ? 'text-right' : ''}`}
                     >
                        {Object.keys(t[lang].platforms).map(p => (
                          <option key={p} value={p}>{t[lang].platforms[p as keyof typeof t['en']['platforms']]}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-mono text-accent-violet uppercase tracking-widest">URL</label>
                     <input 
                       type="text"
                       placeholder={t[lang].placeholders.url}
                       value={newLink.url}
                       onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                       className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-violet/50 ${isRtl ? 'text-right' : ''}`}
                     />
                  </div>
               </div>
               <div className={`flex items-center gap-3 pt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <button onClick={addNewLink} className="flex-1 py-2.5 bg-accent-violet text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-violet/80 transition-all">
                    {t[lang].actions.save}
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/5">
                    {t[lang].actions.cancel}
                  </button>
               </div>
            </div>
          )}

          {socials.map((link) => (
            <div key={link.id} className={`bg-[#0c0c0c] border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-white/10 transition-colors ${!link.isActive ? 'opacity-50' : ''} ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${link.isActive ? 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet' : 'bg-white/5 border-white/10 text-white/20'}`}>
                {socialIcons[link.platform] || <ExternalLink className="w-4 h-4" />}
              </div>
              
              <div className={`flex-1 space-y-1 ${isRtl ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <select 
                    value={link.platform}
                    onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                    className="bg-transparent text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] outline-none cursor-pointer hover:text-white/40 transition-colors"
                   >
                      {Object.keys(t[lang].platforms).map(p => (
                        <option key={p} value={p} className="bg-[#080808]">{t[lang].platforms[p as keyof typeof t['en']['platforms']]}</option>
                      ))}
                   </select>
                </div>
                <input 
                  type="text" 
                  value={link.url} 
                  dir="ltr"
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  className={`w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-white/5 focus:text-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`} 
                  placeholder={`https://...`} 
                />
              </div>

              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <button 
                  onClick={() => updateLink(link.id, 'isActive', !link.isActive)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${link.isActive ? 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet' : 'bg-white/5 border-white/10 text-white/20'}`}
                 >
                   <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-accent-violet animate-pulse' : 'bg-white/20'}`} />
                 </button>
                 <button 
                  onClick={() => deleteLink(link.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/2 text-white/20 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                 >
                    <Trash2 className="w-4 h-4" />
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
