import { useState } from 'react';
import { FolderGit2, Plus, Search, MoreVertical, Edit2, Archive, Trash2 } from 'lucide-react';
import { ProjectEditorModal } from '../components/projects/ProjectEditorModal';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';
import type { Project } from '../../types/admin';

export const ProjectsManager = () => {
  const { projects, setProjects } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'archived'>('all');
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Projects CMS',
      subtitle: 'Manage portfolio showcases & case studies',
      newBtn: 'New Project',
      searchPlaceholder: 'Search projects...',
      all: 'All',
      published: 'Published',
      archived: 'Archived',
      table: {
        name: 'Project Name',
        category: 'Category',
        status: 'Status',
        modified: 'Date Modified',
        actions: 'Actions'
      },
      status: {
        published: 'Published',
        archived: 'Archived'
      },
      footer: {
        records: 'records found',
        end: 'End of list'
      },
      deleteConfirm: 'Are you sure you want to delete this project?',
      tooltips: {
        edit: 'Edit Content',
        archive: 'Archive',
        publish: 'Publish',
        delete: 'Delete',
        more: 'More'
      }
    },
    ar: {
      title: 'إدارة المشاريع',
      subtitle: 'إدارة معرض الأعمال ودراسات الحالة',
      newBtn: 'مشروع جديد',
      searchPlaceholder: 'البحث في المشاريع...',
      all: 'الكل',
      published: 'المنشورة',
      archived: 'الأرشيف',
      table: {
        name: 'اسم المشروع',
        category: 'الفئة',
        status: 'الحالة',
        modified: 'تاريخ التعديل',
        actions: 'إجراءات'
      },
      status: {
        published: 'منشور',
        archived: 'مؤرشف'
      },
      footer: {
        records: 'مشاريع موجودة',
        end: 'نهاية القائمة'
      },
      deleteConfirm: 'هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.',
      tooltips: {
        edit: 'تعديل المحتوى',
        archive: 'أرشفة',
        publish: 'نشر',
        delete: 'حذف',
        more: 'المزيد'
      }
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setEditingProject(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleArchive = (id: number) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'published' ? 'archived' : 'published' } : p
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t[lang].deleteConfirm)) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
        </div>
        
        <button 
          onClick={handleCreateNew}
          className={`flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl transition-all duration-300 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">{t[lang].newBtn}</span>
        </button>
      </div>

      <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className={`p-4 border-b border-white/5 flex items-center justify-between bg-black/20 ${isRtl ? 'flex-row-reverse' : ''}`}>
           <div className="relative w-full max-w-xs">
             <input 
               type="text" 
               placeholder={t[lang].searchPlaceholder}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className={`w-full bg-black/50 border border-white/10 rounded-lg py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
             />
             <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
           </div>

           <div className={`hidden sm:flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
             {(['all', 'published', 'archived'] as const).map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${
                    filter === f ? 'text-accent-violet bg-accent-violet/10' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {/* @ts-ignore */}
                  {t[lang][f]}
                </button>
             ))}
           </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white/60">
            <thead className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-black/40">
              <tr className={isRtl ? 'flex-row-reverse items-center' : ''}>
                <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].table.name}</th>
                <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].table.category}</th>
                <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].table.status}</th>
                <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].table.modified}</th>
                <th className={`px-6 py-4 font-medium ${isRtl ? 'text-left' : 'text-right'}`}>{t[lang].table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className={`px-6 py-5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                         {project.featuredMediaUrl ? (
                           <img src={project.featuredMediaUrl} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <FolderGit2 className="w-4 h-4 text-white/50" />
                         )}
                      </div>
                      <div>
                        <div className={`font-black text-white text-sm uppercase tracking-wider flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          {project.title}
                          {project.isFeatured && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" title="Featured Project" />
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-widest text-wrap max-w-44 break-all">ID_{project.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-xs font-mono opacity-80 ${isRtl ? 'text-right' : 'text-left'}`}>{project.category}</td>
                  <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {project.status === 'published' ? (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-mono uppercase tracking-wider">
                        {t[lang].status.published}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-white/5 text-white/40 border border-white/10 rounded text-[9px] font-mono uppercase tracking-wider">
                        {t[lang].status.archived}
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-xs font-mono ripple-effect ${isRtl ? 'text-right' : 'text-left'}`}>{project.date}</td>
                  <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                    <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? 'justify-start' : 'justify-end'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white" 
                        title={t[lang].tooltips.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleArchive(project.id); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-accent-violet" 
                        title={project.status === 'published' ? t[lang].tooltips.archive : t[lang].tooltips.publish}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-red-400" 
                        title={t[lang].tooltips.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white" title={t[lang].tooltips.more}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span>{filteredProjects.length} {t[lang].footer.records}</span>
          <span>{t[lang].footer.end}</span>
        </div>
      </div>

      {/* Logic to Render Modal */}
      {isEditorOpen && (
        <ProjectEditorModal 
          lang={lang}
          onClose={() => setIsEditorOpen(false)}
          project={editingProject}
        />
      )}
    </div>
  );
};
