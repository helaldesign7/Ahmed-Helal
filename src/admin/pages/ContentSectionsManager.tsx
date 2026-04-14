import { useState } from 'react';
import { LayoutList, GripVertical, ArrowUp, ArrowDown, Image as ImageIcon, MessageSquareQuote, Link as LinkIcon, Edit3, X, Type } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdmin } from '../../contexts/useAdmin';
import { DictionaryEditor } from '../components/DictionaryEditor';
import { TestimonialsManager } from '../components/sub-managers/TestimonialsManager';
import { ClientLogosManager } from '../components/sub-managers/ClientLogosManager';
import { SocialLinksManager } from '../components/sub-managers/SocialLinksManager';
import { FooterManager } from '../components/sub-managers/FooterManager';
import { useOutletContext } from 'react-router-dom';
import type { SectionBlueprint, SectionId } from '../../types/admin';

// --- Sortable Item Component ---
const SortableSectionItem = ({ 
  section, index, total, lang, t, isRtl, moveSection, toggleVisibility, toggleNavbarVisibility, activeEditor, setActiveEditor, setEditingLabel 
}: { 
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  section: SectionBlueprint; index: number; total: number; lang: 'en'|'ar'; t: any; isRtl: boolean; 
  moveSection: (id: SectionId, direction: 'up'|'down') => void; 
  toggleVisibility: (id: SectionId) => void;
  toggleNavbarVisibility: (id: SectionId) => void;
  activeEditor: string | null; 
  setActiveEditor: (id: string|null) => void;
  setEditingLabel: (section: SectionBlueprint | null) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-black/20 border border-white/5 rounded-xl overflow-hidden transition-colors duration-300 ${isDragging ? 'shadow-2xl shadow-accent-violet/20 border-accent-violet/50' : ''}`}>
      <div className={`flex items-center justify-between p-3 bg-white/2 hover:bg-white/5 transition-colors group ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-white/5 transition-colors">
            <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/50" />
          </div>
          <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
            <span className="text-sm font-bold text-white mb-0.5">{section.name}</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-accent-violet">{section.type} {t[lang].layer}</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button onClick={() => moveSection(section.id, 'up')} disabled={index === 0} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowUp className="w-3 h-3" />
          </button>
          <button onClick={() => moveSection(section.id, 'down')} disabled={index === total - 1} className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowDown className="w-3 h-3" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          
          <button 
            onClick={() => toggleNavbarVisibility(section.id)}
            title={lang === 'ar' ? 'تبديل الظهور في القائمة العلوية' : 'Toggle Navbar Visibility'}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-colors border flex items-center gap-2 ${section.inNavbar ? 'bg-accent-violet/20 text-accent-violet border-accent-violet/30' : 'bg-white/5 text-white/20 border-white/5'}`}
          >
            <LayoutList className="w-3 h-3" />
            {section.inNavbar ? 'Navbar' : '---'}
          </button>
          
          <button 
            onClick={() => setEditingLabel(section)}
            title={lang === 'ar' ? 'تعديل مسمى القائمة' : 'Edit Navbar Label'}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Type className="w-3 h-3" />
          </button>

          <button 
            onClick={() => toggleVisibility(section.id)}
            className={`min-w-[70px] px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-colors border ${section.isVisible ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
          >
            {section.isVisible ? t[lang].status.visible : t[lang].status.hidden}
          </button>
          <button 
            onClick={() => setActiveEditor(activeEditor === section.id ? null : section.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${isRtl ? 'mr-2' : 'ml-2'} ${activeEditor === section.id ? 'bg-accent-violet text-white border-accent-violet/50' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'}`}
          >
            {activeEditor === section.id ? <X className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
            {activeEditor === section.id ? t[lang].actions.close : t[lang].actions.edit}
          </button>
        </div>
      </div>
      
      {activeEditor === section.id && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-t border-white/5">
          <DictionaryEditor sectionId={section.id} />
        </div>
      )}
    </div>
  );
};
// ------------------------------

export const ContentSectionsManager = () => {
  const { sections, toggleVisibility, toggleNavbarVisibility, moveSection, setSectionsOrder } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeEditor, setActiveEditor] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'testimonials' | 'logos' | 'social' | 'footer' | null>(null);
  const [editingLabel, setEditingLabel] = useState<SectionBlueprint | null>(null);
  const { updateSectionLabel } = useAdmin();

  const isRtl = lang === 'ar';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSectionsOrder(newSections);
    }
  };

  const t = {
    en: {
      title: 'Sections & Content',
      subtitle: 'Manage page layout, testimonials, and brand assets',
      blueprint: 'Page Blueprint',
      status: {
        visible: 'Visible',
        hidden: 'Hidden'
      },
      actions: {
        edit: 'Edit Texts',
        close: 'Close Texts'
      },
      subManagers: {
        testimonials: {
          title: 'Testimonials',
          subtitle: 'Global Reputation Matrix',
          manage: 'Manage'
        },
        logos: {
          title: 'Client Logos',
          subtitle: 'Marquee Visual Assets',
          manage: 'Manage'
        },
        social: {
          title: 'Social Icons & Links',
          subtitle: 'External Connectivity Nodes',
          manage: 'Manage'
        },
        footer: {
          title: 'Footer Branding',
          subtitle: 'Copyright & Role Details',
          manage: 'Manage'
        }
      },
      layer: 'layer'
    },
    ar: {
      title: 'الأقسام والمحتوى',
      subtitle: 'إدارة تخطيط الصفحة، التوصيات، وأصول العلامة التجارية',
      blueprint: 'مخطط الصفحة الرئيسي',
      status: {
        visible: 'ظاهر',
        hidden: 'مخفي'
      },
      actions: {
        edit: 'تعديل النصوص',
        close: 'إغلاق المحرر'
      },
      subManagers: {
        testimonials: {
          title: 'توصيات العملاء',
          subtitle: 'مصفوفة السمعة العالمية',
          manage: 'إدارة'
        },
        logos: {
          title: 'شعارات العملاء',
          subtitle: 'أصول بصرية متميزة',
          manage: 'إدارة'
        },
        social: {
          title: 'أيقونات وروابط التواصل',
          subtitle: 'عقد الاتصال الخارجي',
          manage: 'إدارة'
        },
        footer: {
          title: 'هوية أسفل الصفحة',
          subtitle: 'بيانات الحقوق والتخصص',
          manage: 'إدارة'
        }
      },
      layer: 'طبقة'
    }
  };

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Sections Reordering & Visibility */}
        <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6">
          <h2 className={`text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4 mb-6 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <LayoutList className="w-4 h-4 text-accent-violet" /> {t[lang].blueprint}
          </h2>
          
          <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map((section, index) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    index={index}
                    total={sections.length}
                    lang={lang}
                    t={t}
                    isRtl={isRtl}
                    moveSection={moveSection}
                    toggleVisibility={toggleVisibility}
                    toggleNavbarVisibility={toggleNavbarVisibility}
                    activeEditor={activeEditor}
                    setActiveEditor={setActiveEditor}
                    setEditingLabel={setEditingLabel}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Right Column: Other Minor Content CMS */}
        <div className="space-y-6">
           <div 
             className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-shadow cursor-pointer"
             onClick={() => setActiveModal('testimonials')}
           >
              <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20">
                    <MessageSquareQuote className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{t[lang].subManagers.testimonials.title}</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{t[lang].subManagers.testimonials.subtitle}</p>
                  </div>
                </div>
                <button className={`text-[10px] font-mono text-accent-violet uppercase hover:underline ${isRtl ? 'rotate-180' : ''}`}>
                  {t[lang].subManagers.testimonials.manage} &rarr;
                </button>
              </div>
           </div>

           <div 
             className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-shadow cursor-pointer"
             onClick={() => setActiveModal('logos')}
           >
              <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20">
                    <ImageIcon className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{t[lang].subManagers.logos.title}</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{t[lang].subManagers.logos.subtitle}</p>
                  </div>
                </div>
                <button className={`text-[10px] font-mono text-accent-violet uppercase hover:underline ${isRtl ? 'rotate-180' : ''}`}>
                  {t[lang].subManagers.logos.manage} &rarr;
                </button>
              </div>
           </div>

           <div 
             className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-shadow cursor-pointer"
             onClick={() => setActiveModal('social')}
           >
              <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20">
                    <LinkIcon className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{t[lang].subManagers.social.title}</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{t[lang].subManagers.social.subtitle}</p>
                  </div>
                </div>
                <button className={`text-[10px] font-mono text-accent-violet uppercase hover:underline ${isRtl ? 'rotate-180' : ''}`}>
                  {t[lang].subManagers.social.manage} &rarr;
                </button>
              </div>
           </div>

           <div 
             className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-shadow cursor-pointer"
             onClick={() => setActiveModal('footer')}
           >
              <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20">
                    <LayoutList className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{t[lang].subManagers.footer.title}</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{t[lang].subManagers.footer.subtitle}</p>
                  </div>
                </div>
                <button className={`text-[10px] font-mono text-accent-violet uppercase hover:underline ${isRtl ? 'rotate-180' : ''}`}>
                  {t[lang].subManagers.footer.manage} &rarr;
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Modals with Lang Support */}
      {activeModal === 'testimonials' && <TestimonialsManager lang={lang} onClose={() => setActiveModal(null)} />}
      {activeModal === 'logos' && <ClientLogosManager lang={lang} onClose={() => setActiveModal(null)} />}
      {activeModal === 'social' && <SocialLinksManager lang={lang} onClose={() => setActiveModal(null)} />}
      {activeModal === 'footer' && <FooterManager lang={lang} onClose={() => setActiveModal(null)} />}
      {/* Label Edit Modal */}
      {editingLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-accent-violet" />
                {lang === 'ar' ? 'تعديل مسمى القائمة' : 'Edit Navbar Label'}
              </h3>
              <button onClick={() => setEditingLabel(null)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
                  English Label
                </label>
                <input 
                  type="text"
                  defaultValue={editingLabel.navLabel?.en || editingLabel.name}
                  id="nav-label-en"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 outline-none transition-all"
                  placeholder="e.g. Portfolio"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
                  Arabic Label (العربية)
                </label>
                <input 
                  type="text"
                  dir="rtl"
                  defaultValue={editingLabel.navLabel?.ar || editingLabel.name}
                  id="nav-label-ar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-right focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 outline-none transition-all"
                  placeholder="مثال: أعمالي"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => setEditingLabel(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={() => {
                  const en = (document.getElementById('nav-label-en') as HTMLInputElement).value;
                  const ar = (document.getElementById('nav-label-ar') as HTMLInputElement).value;
                  updateSectionLabel(editingLabel.id, { en, ar });
                  setEditingLabel(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-accent-violet text-white font-bold hover:bg-accent-violet/80 transition-all shadow-lg shadow-accent-violet/20"
              >
                {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
