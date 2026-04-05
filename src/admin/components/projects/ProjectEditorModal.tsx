import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Type, Check, Globe, Layout, Layers, FileText, Hash } from 'lucide-react';
import { MediaPicker } from '../media/MediaPicker';
import { useAdmin } from '../../../contexts/useAdmin';
import type { Project } from '../../../types/admin';

interface ProjectEditorModalProps {
  onClose: () => void;
  project?: Project;
  lang?: 'en' | 'ar';
}

export const ProjectEditorModal = ({ onClose, project, lang = 'en' }: ProjectEditorModalProps) => {
  const { projects, setProjects } = useAdmin();
  const isEditing = !!project;
  const isRtl = lang === 'ar';

  const t = {
    en: {
      editTitle: `Edit Record: ID_${project?.id}`,
      createTitle: 'Initialize New Project',
      editSub: 'Update project data',
      createSub: 'New entry for Projects CMS → Featured Work section',
      identity: 'Project Identity',
      titleLabel: 'Title',
      categoryLabel: 'Category',
      classification: 'Classification',
      publicImage: 'Card Image (Public View)',
      publicImageSub: 'Displayed in Featured Work grid',
      adminImage: 'Dashboard Cover (Admin View)',
      adminImageSub: 'Used as fallback if Card Image is empty',
      contentLabel: 'Case Study Content (Markdown)',
      orderLabel: 'Display Order',
      orderSub: 'Lower = shown first (featured projects always appear first)',
      statusLabel: 'Status: Published',
      statusSub: 'Visible in Featured Work section',
      featuredLabel: 'Featured Mode',
      featuredSub: 'Pinned at top with Featured badge',
      cancel: 'Cancel',
      save: 'Save Changes',
      create: 'Create Project',
      validation: 'Please fill in the English title and category.'
    },
    ar: {
      editTitle: `تعديل الطلب: ID_${project?.id}`,
      createTitle: 'تعريف مشروع جديد',
      editSub: 'تحديث بيانات المشروع',
      createSub: 'إدخال جديد لنظام إدارة المشاريع ← قسم الأعمال المميزة',
      identity: 'هوية المشروع',
      titleLabel: 'العنوان',
      categoryLabel: 'التصنيف',
      classification: 'التصنيف العام',
      publicImage: 'صورة البطاقة (العرض العام)',
      publicImageSub: 'تظهر في شبكة الأعمال المميزة بالموقع',
      adminImage: 'غلاف لوحة التحكم (عرض الإدارة)',
      adminImageSub: 'يستخدم كبديل في حال عدم وجود صورة للبطاقة',
      contentLabel: 'محتوى دراسة الحالة (Markdown)',
      orderLabel: 'ترتيب العرض',
      orderSub: 'الرقم الأقل يظهر أولاً (المشاريع المميزة تظهر دائماً في البداية)',
      statusLabel: 'الحالة: منشور',
      statusSub: 'يظهر في قسم الأعمال المميزة على الموقع',
      featuredLabel: 'وضع التمييز (Featured)',
      featuredSub: 'يتم تثبيته في الأعلى مع شارة مشروع مميز',
      cancel: 'إلغاء',
      save: 'حفظ التعديلات',
      create: 'إنشاء المشروع',
      validation: 'يرجى ملء العنوان والتصنيف باللغة الإنجليزية.'
    }
  };

  const [formData, setFormData] = useState<Omit<Project, 'id' | 'date'>>({
    title: project?.title || '',
    titleAr: project?.titleAr || '',
    category: project?.category || '',
    categoryAr: project?.categoryAr || '',
    status: project?.status || 'published',
    isFeatured: project?.isFeatured || false,
    content: project?.content || '# Project Scope\n\nWrite details here...',
    featuredMediaUrl: project?.featuredMediaUrl || '',
    imageUrl: project?.imageUrl || '',
    displayOrder: project?.displayOrder ?? 0,
  });

  const set = (key: keyof typeof formData, val: unknown) =>
    setFormData(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!formData.title || !formData.category) {
      alert(t[lang].validation);
      return;
    }

    if (isEditing && project) {
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...formData } : p));
    } else {
      const newProject: Project = {
        ...formData,
        id: Math.max(0, ...projects.map(p => p.id)) + 1,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };
      setProjects(prev => [newProject, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className={`relative w-full max-w-4xl max-h-[92vh] bg-primary-black border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isRtl ? 'text-right' : ''}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-8 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              {isEditing ? t[lang].editTitle : t[lang].createTitle}
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mt-2">
              {isEditing ? t[lang].editSub : t[lang].createSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/5 text-white/20 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">

          {/* --- Title --- */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Type className="w-4 h-4 text-accent-violet" />
              <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].identity}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'ml-1'}`}>
                  <Globe className="w-3 h-3" /> {t[lang].titleLabel} (EN)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => set('title', e.target.value)}
                  className={`w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`}
                  placeholder="e.g. Creative Campaign"
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'ml-1'}`}>
                  <Globe className="w-3 h-3" /> {t[lang].titleLabel} (AR)
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={e => set('titleAr', e.target.value)}
                  className={`w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-colors text-right font-arabic`}
                  placeholder="العنوان بالعربية..."
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* --- Category --- */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Layout className="w-4 h-4 text-accent-violet" />
              <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].classification}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'ml-1'}`}>
                   {t[lang].categoryLabel} (EN)
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => set('category', e.target.value)}
                  className={`w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`}
                  placeholder="e.g. Branding"
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'ml-1'}`}>
                   {t[lang].categoryLabel} (AR)
                </label>
                <input
                  type="text"
                  value={formData.categoryAr}
                  onChange={e => set('categoryAr', e.target.value)}
                  className={`w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-colors text-right font-arabic`}
                  placeholder="التصنيف بالعربية..."
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* --- Media --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Layers className="w-4 h-4 text-accent-violet" />
                <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].publicImage}</span>
              </div>
              <MediaPicker
                label={t[lang].publicImageSub}
                value={formData.imageUrl || ''}
                onChange={url => set('imageUrl', url)}
              />
            </div>

            <div className="space-y-4">
              <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <ImageIcon className="w-4 h-4 text-accent-violet" />
                <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].adminImage}</span>
              </div>
              <MediaPicker
                label={t[lang].adminImageSub}
                value={formData.featuredMediaUrl}
                onChange={url => set('featuredMediaUrl', url)}
              />
            </div>
          </div>

          {/* --- Content --- */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <FileText className="w-4 h-4 text-accent-violet" />
              <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].contentLabel}</span>
            </div>
            <textarea
              value={formData.content}
              onChange={e => set('content', e.target.value)}
              rows={8}
              className={`w-full bg-primary-black border border-white/10 rounded-3xl px-6 py-6 text-sm font-mono text-white/80 focus:outline-none focus:border-accent-violet transition-all custom-scrollbar leading-relaxed ${isRtl ? 'text-right' : ''}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Order */}
             <div className="space-y-3">
                <div className={`flex items-center gap-2 pb-2 border-b border-white/5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Hash className="w-3.5 h-3.5 text-accent-violet" />
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest">{t[lang].orderLabel}</span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.displayOrder ?? 0}
                  onChange={e => set('displayOrder', Number(e.target.value))}
                  className={`w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`}
                />
                <p className="text-[8px] font-mono text-white/20 uppercase leading-relaxed tracking-wider">{t[lang].orderSub}</p>
             </div>

             {/* Toggles */}
             <div
              onClick={() => set('status', formData.status === 'published' ? 'archived' : 'published')}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                formData.status === 'published'
                  ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  formData.status === 'published' ? 'text-green-400' : 'text-white/30'
                }`}>{t[lang].statusLabel}</span>
                {formData.status === 'published' && <Check className="w-4 h-4 text-green-400" />}
              </div>
              <p className="text-[10px] font-mono text-white/40 mt-4 leading-relaxed uppercase">{t[lang].statusSub}</p>
            </div>

            <div
              onClick={() => set('isFeatured', !formData.isFeatured)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                formData.isFeatured
                  ? 'bg-accent-violet/10 border-accent-violet/30 ring-1 ring-accent-violet/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  formData.isFeatured ? 'text-accent-violet' : 'text-white/30'
                }`}>{t[lang].featuredLabel}</span>
                {formData.isFeatured && <Check className="w-4 h-4 text-accent-violet" />}
              </div>
              <p className="text-[10px] font-mono text-white/40 mt-4 leading-relaxed uppercase">{t[lang].featuredSub}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`p-8 border-t border-white/5 bg-primary-black shrink-0 flex items-center justify-end gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
          >
            {t[lang].cancel}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-3 bg-white text-black hover:bg-accent-violet hover:text-white px-10 py-4 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-accent-violet/20 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Save className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {isEditing ? t[lang].save : t[lang].create}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
import { Image as ImageIcon } from 'lucide-react';
