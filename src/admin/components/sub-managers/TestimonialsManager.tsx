import { Plus, Trash2, GripVertical, XCircle, User, MessageSquare, Briefcase, Camera } from 'lucide-react';
import { useAdmin } from '../../../contexts/useAdmin';
import type { TestimonialItem } from '../../../types/admin';

export const TestimonialsManager = ({ onClose, lang = 'en' }: { onClose: () => void, lang?: 'en' | 'ar' }) => {
  const { siteContent, updateSectionArray } = useAdmin();
  const testimonials = siteContent.testimonials.items || [];
  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Testimonials Manager',
      subtitle: 'Manage global reputation matrix',
      add: 'Add New',
      confirm: 'Remove testimonial from list?',
      placeholders: {
        name: 'Client Name',
        role: 'Role (e.g. CEO)',
        company: 'Company',
        quote: 'Client Quote...',
        avatar: 'Avatar URL'
      }
    },
    ar: {
      title: 'إدارة التوصيات',
      subtitle: 'إدارة مصفوفة السمعة العالمية',
      add: 'إضافة جديد',
      confirm: 'هل تريد إزالة هذه التوصية من القائمة؟',
      placeholders: {
        name: 'اسم العميل',
        role: 'المنصب (مثال: المدير التنفيذي)',
        company: 'الشركة',
        quote: 'رأي العميل...',
        avatar: 'رابط الصورة الرمزية'
      }
    }
  };

  const handleAdd = () => {
    const newItem: TestimonialItem = {
      name: { en: 'New Client', ar: 'عميل جديد' },
      role: { en: 'CEO', ar: 'المدير التنفيذي' },
      company: { en: 'Company Name', ar: 'اسم الشركة' },
      quote: { en: 'Excellent work!', ar: 'عمل ممتاز!' },
      avatar: 'https://i.pravatar.cc/150?u=' + Math.random()
    };
    updateSectionArray('testimonials', 'items', [...testimonials, newItem]);
  };

  const handleDelete = (index: number) => {
    if (confirm(t[lang].confirm)) {
      const next = [...testimonials];
      next.splice(index, 1);
      updateSectionArray('testimonials', 'items', next);
    }
  };

  const handleUpdateField = (index: number, field: keyof TestimonialItem, subField: 'en' | 'ar' | 'raw', value: string) => {
    const next = [...testimonials];
    const item = { ...next[index] };
    
    if (field === 'avatar') {
      (item[field] as string) = value;
    } else {
      const fieldData = { ...(item[field] as { en: string; ar: string }) };
      if (subField === 'raw') {
         // Should not happen for localized fields
      } else {
         fieldData[subField] = value;
      }
      (item[field] as { en: string; ar: string }) = fieldData;
    }
    
    next[index] = item;
    updateSectionArray('testimonials', 'items', next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`w-full max-w-4xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${isRtl ? 'text-right' : ''}`}>
        
        <div className={`flex items-center justify-between p-6 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-xl font-black tracking-widest uppercase bg-linear-to-r from-white to-white/40 bg-clip-text text-transparent">{t[lang].title}</h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-1">{t[lang].subtitle}</p>
          </div>
          <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent-violet/20"
            >
              <Plus className="w-4 h-4" /> {t[lang].add}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <XCircle className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {testimonials.map((item, idx) => (
            <div key={idx} className={`bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 group hover:border-accent-violet/30 transition-all duration-500 relative ${isRtl ? 'text-right' : ''}`}>
              <div className={`flex flex-col lg:flex-row gap-6 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                   <div className="relative group/avatar">
                      <img src={item.avatar} className="w-24 h-24 rounded-2xl object-cover border border-white/10 group-hover/avatar:border-accent-violet/50 transition-all shadow-2xl shadow-black/50" alt="Avatar" />
                      <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                         <Camera className="w-6 h-6 text-white/60" />
                      </div>
                   </div>
                   <div className="flex items-center gap-2 w-full max-w-[120px] bg-black/40 px-2 py-1.5 rounded-lg border border-white/5">
                      <Camera className="w-3 h-3 text-white/20" />
                      <input 
                        type="text" 
                        value={item.avatar}
                        onChange={(e) => handleUpdateField(idx, 'avatar', 'raw', e.target.value)}
                        className="bg-transparent text-[8px] font-mono text-white/40 outline-none w-full truncate"
                        placeholder="Avatar URL"
                      />
                   </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4">
                   <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRtl ? 'text-right' : ''}`}>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                           <User className="w-3 h-3" /> {lang === 'en' ? 'NAME (EN)' : 'الاسم (EN)'}
                        </label>
                        <input 
                          type="text"
                          value={item.name.en}
                          onChange={(e) => handleUpdateField(idx, 'name', 'en', e.target.value)}
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-accent-violet/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                           <User className="w-3 h-3" /> {lang === 'en' ? 'NAME (AR)' : 'الاسم (AR)'}
                        </label>
                        <input 
                          type="text"
                          dir="rtl"
                          value={item.name.ar}
                          onChange={(e) => handleUpdateField(idx, 'name', 'ar', e.target.value)}
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-accent-violet/50 outline-none transition-all"
                        />
                      </div>
                   </div>

                   <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRtl ? 'text-right' : ''}`}>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Briefcase className="w-3 h-3" /> {lang === 'en' ? 'COMPANY (EN)' : 'الشركة (EN)'}
                        </label>
                        <input 
                          type="text"
                          value={item.company.en}
                          onChange={(e) => handleUpdateField(idx, 'company', 'en', e.target.value)}
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-mono text-accent-violet outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Briefcase className="w-3 h-3" /> {lang === 'en' ? 'ROLE (EN)' : 'المنصب (EN)'}
                        </label>
                        <input 
                          type="text"
                          value={item.role.en}
                          onChange={(e) => handleUpdateField(idx, 'role', 'en', e.target.value)}
                          className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-mono text-white/40 outline-none"
                        />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                         <MessageSquare className="w-3 h-3" /> QUOTE (EN)
                      </label>
                      <textarea 
                        rows={2}
                        value={item.quote.en}
                        onChange={(e) => handleUpdateField(idx, 'quote', 'en', e.target.value)}
                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/60 outline-none focus:border-accent-violet/50 resize-none transition-all"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                         <MessageSquare className="w-3 h-3" /> QUOTE (AR)
                      </label>
                      <textarea 
                        rows={2}
                        dir="rtl"
                        value={item.quote.ar}
                        onChange={(e) => handleUpdateField(idx, 'quote', 'ar', e.target.value)}
                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/60 outline-none focus:border-accent-violet/50 resize-none transition-all"
                      />
                   </div>
                </div>

                {/* Actions Sidebar */}
                <div className="flex lg:flex-col gap-2">
                   <button 
                     onClick={() => handleDelete(idx)}
                     className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all group/del"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                   <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 cursor-grab active:cursor-grabbing hover:bg-white/10 hover:text-white transition-all">
                      <GripVertical className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/2 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] text-center">
           SECURE REPUTATION NODE ACCESS
        </div>
      </div>
    </div>
  );
};
