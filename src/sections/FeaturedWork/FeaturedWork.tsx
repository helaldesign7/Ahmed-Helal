import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';
import { ChevronDown, Plus } from 'lucide-react';
import type { Language } from '../../data/content';

interface FeaturedWorkProps {
  lang: Language;
  id?: string;
}

export const FeaturedWork = ({ lang, id }: FeaturedWorkProps) => {
  // Read from AdminContext: use CMS-managed projects (published + featured first)
  const { projects, siteContent } = useAdmin();
  const { featuredWork } = siteContent;
  const [showAll, setShowAll] = useState(false);

  // Filter to published only, sort featured first then by displayOrder
  const publishedProjects = projects
    .filter(p => p.status === 'published')
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? a.id) - (b.displayOrder ?? b.id);
    });

  const initialCount = 6;
  const displayedProjects = showAll ? publishedProjects : publishedProjects.slice(0, initialCount);

  return (
    <section id={id} className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-violet/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-heading font-black mb-4 leading-none"
            >
              {featuredWork.title[lang]}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 max-w-xl font-medium"
            >
              {featuredWork.subtitle[lang]}
            </motion.p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-accent-violet/40">
              Project Archive / 2024–2026
            </div>
            <div className="px-3 py-1 bg-accent-violet/10 border border-accent-violet/20 rounded-full text-[10px] font-mono font-black text-accent-violet uppercase tracking-widest">
              {publishedProjects.length} cases
            </div>
          </div>
        </div>

        {/* Empty State */}
        {publishedProjects.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-white/20">
            <div className="text-5xl mb-4">📁</div>
            <p className="font-mono text-sm uppercase tracking-[0.3em]">
              {lang === 'ar' ? 'لا توجد مشاريع منشورة بعد' : 'No published projects yet'}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-60">
              {lang === 'ar' ? 'أضف مشاريع عبر لوحة التحكم' : 'Add projects via the Dashboard → Projects CMS'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => {
              const titleText = lang === 'ar' && project.titleAr ? project.titleAr : project.title;
              const categoryText = lang === 'ar' && project.categoryAr ? project.categoryAr : project.category;
              // Use imageUrl if set, otherwise fall back to featuredMediaUrl
              const imageSrc = project.imageUrl || project.featuredMediaUrl;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % initialCount) * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-gh-dark border border-white/5 cursor-pointer"
                >
                  {/* Featured badge */}
                  {project.isFeatured && (
                    <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-accent-violet/90 backdrop-blur-md rounded-full text-[9px] font-mono font-black uppercase tracking-widest text-white border border-accent-violet/50">
                      Featured
                    </div>
                  )}

                  {/* Project Image */}
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={titleText}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-accent-violet/10 to-transparent flex items-center justify-center">
                      <span className="text-white/10 font-heading font-black text-6xl uppercase tracking-tighter">
                        {titleText.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary-black via-primary-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex items-center gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0">
                      <span className="w-8 h-px bg-accent-violet" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-accent-violet font-black font-mono">
                        {categoryText}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight">
                      {titleText}
                    </h3>
                    <div className="h-1 w-0 bg-accent-violet group-hover:w-20 transition-all duration-700 delay-100 rounded-full" />
                  </div>

                  {/* Corner Numbering */}
                  <div className="absolute top-8 right-8 text-[10px] font-mono font-black text-white/10 group-hover:text-accent-violet/40 transition-colors uppercase tracking-widest">
                    CASE NO. {String(index + 1).padStart(2, '0')}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More / View Less */}
        {publishedProjects.length > initialCount && (
          <div className="mt-20 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-4 px-10 py-5 rounded-full bg-white/5 border border-white/10 hover:border-accent-violet/50 hover:bg-accent-violet/5 transition-all duration-500 overflow-hidden relative"
            >
               <div className="absolute inset-0 bg-linear-to-r from-accent-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-white relative z-10">
                 {showAll
                   ? (lang === 'ar' ? 'عرض أقل' : 'View Archive Limit')
                   : (lang === 'ar' ? 'استكشاف الأرشيف الكامل' : `Explore Full Archive (${publishedProjects.length - initialCount} more)`)}
               </span>
               <div className={`transition-transform duration-500 relative z-10 ${showAll ? 'rotate-180' : ''}`}>
                 {showAll ? <ChevronDown className="w-4 h-4 text-accent-violet" /> : <Plus className="w-4 h-4 text-accent-violet" />}
               </div>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};
