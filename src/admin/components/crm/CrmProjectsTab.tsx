import { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, Code, GripVertical, ChevronRight } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdmin } from '../../../contexts/useAdmin';
import type { CRMProject, CRMClient } from '../../../types/admin';

const SortableProjectRow = ({ project, isRtl, getClientName, updateCrmProject, handleDelete }: { 
  project: CRMProject, 
  isRtl: boolean, 
  getClientName: (id: number) => string, 
  updateCrmProject: (id: number, updates: Partial<CRMProject>) => void, 
  handleDelete: (id: number) => void 
}) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${isDragging ? 'shadow-2xl bg-white/5 border-l-2 border-accent-violet' : ''}`}>
      <td className={`px-6 py-5 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-white/10 transition-colors opacity-50 hover:opacity-100">
            <GripVertical className="w-4 h-4 text-white" />
          </div>
          <Code className="w-4 h-4 text-accent-violet opacity-60 shrink-0" />
          <div className={isRtl ? 'text-right' : ''}>
            <div className="text-white/90 font-bold text-xs uppercase tracking-wider">{project.project_name}</div>
            <div className="text-[10px] font-mono text-white/40 mt-1 max-w-[200px] truncate">{project.description || 'No description...'}</div>
          </div>
        </div>
      </td>
      <td className={`px-6 py-4 text-xs font-mono text-white/70 ${isRtl ? 'text-right' : 'text-left'}`}>
         {getClientName(project.client_id)}
      </td>
      <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
         <select 
           value={project.status}
           onChange={(e) => updateCrmProject(project.id, { status: e.target.value as CRMProject['status'] })}
           className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white focus:outline-none focus:border-accent-violet appearance-none cursor-pointer"
         >
           <option value="pending">⏳ Pending</option>
           <option value="in_progress">⚡ In Progress</option>
           <option value="completed">✅ Completed</option>
           <option value="on_hold">⏸ On Hold</option>
           <option value="cancelled">❌ Cancelled</option>
         </select>
      </td>
      <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
         <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'justify-end'}`}>
           <button 
             onClick={() => navigate(`/admin/projects/${project.id}`)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest group"
           >
             Workspace
             <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
           </button>
           <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-red-400 transition-colors">
             <Trash2 className="w-4 h-4" />
           </button>
         </div>
      </td>
    </tr>
  );
};

export const CrmProjectsTab = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const { crmProjects, crmClients, addCrmProject, updateCrmProject, deleteCrmProject, reorderCrmProjects } = useAdmin();
  const isRtl = lang === 'ar';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Find old/new based on raw crmProjects sort or filtered if you want
      // For simplicity, we just use the reorderCrmProjects context method
      // which acts on the entire list. To find exact new index, we look at the filtered display
      const oldIndex = crmProjects.findIndex((s: CRMProject) => s.id === active.id);
      const newIndex = crmProjects.findIndex((s: CRMProject) => s.id === over.id);
      if(oldIndex !== -1 && newIndex !== -1){
        await reorderCrmProjects(active.id as number, newIndex);
      }
    }
  };

  const t = {
    en: {
      searchPlaceholder: 'Search projects or requirements...',
      newProject: 'Initialize Project',
      projectInfo: 'Project Matrix',
      status: 'Status',
      actions: 'Actions',
      addProjectModalTitle: 'Project Initiation Sequence',
      empty: 'No internal projects registered.',
      save: 'Deploy Request',
      cancel: 'Abort',
      deleteConfirm: 'Are you sure you want to delete this internal project record?'
    },
    ar: {
      searchPlaceholder: 'ابحث عن المشاريع أو المتطلبات...',
      newProject: 'بدء مشروع',
      projectInfo: 'مصفوفة المشروع',
      status: 'الحالة',
      actions: 'إجراءات',
      addProjectModalTitle: 'تكوين مسار المشروع',
      empty: 'لا توجد مشاريع داخلية مسجلة.',
      save: 'نشر الطلب',
      cancel: 'إلغاء',
      deleteConfirm: 'هل أنت متأكد من حذف سجل المشروع الداخلي هذا؟'
    }
  };

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CRMProject>>({
    project_name: '', client_id: 0, description: '', requirements: '', 
    status: 'pending', priority: 'medium', archived: false,
    budget: '', paid_amount: '', remaining_amount: '', tags: []
  });

  const filteredProjects = useMemo(() => {
    return crmProjects
      .filter((p: CRMProject) => 
        p.project_name.toLowerCase().includes(search.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a: CRMProject, b: CRMProject) => (a.display_order || 0) - (b.display_order || 0));
  }, [crmProjects, search]);

  const handleSave = async () => {
    if (!formData.project_name) return;
    await addCrmProject(formData as Omit<CRMProject, 'id' | 'created_at' | 'updated_at'>);
    setShowAddModal(false);
    setFormData({
      project_name: '', client_id: 0, description: '', requirements: '', 
      status: 'pending', priority: 'medium', archived: false,
      budget: '', paid_amount: '', remaining_amount: '', tags: []
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm(t[lang].deleteConfirm)) {
      await deleteCrmProject(id);
    }
  };

  const getClientName = (id: number) => {
    const c = crmClients.find((client: CRMClient) => client.id === id);
    return c ? (c.brand_company || c.name) : 'No Assigned Client';
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : ''}`}>
       {/* Toolbar */}
       <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/20 p-4 border border-white/5 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder={t[lang].searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-black/50 border border-white/10 rounded-lg py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
            />
            <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-3.5 h-3.5" /> {t[lang].newProject}
          </button>
       </div>

       {/* List View */}
       <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/60">
              <thead className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-black/40">
                <tr className={isRtl ? 'flex-row-reverse' : ''}>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].projectInfo}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>Client</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t[lang].status}</th>
                  <th className={`px-6 py-4 font-medium ${isRtl ? 'text-left' : 'text-right'}`}>{t[lang].actions}</th>
                </tr>
              </thead>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                   <tbody className="bg-transparent">
                     {filteredProjects.map((project: CRMProject) => (
                        <SortableProjectRow 
                          key={project.id} 
                          project={project} 
                          isRtl={isRtl} 
                          getClientName={getClientName} 
                          updateCrmProject={updateCrmProject} 
                          handleDelete={handleDelete} 
                        />
                     ))}
                     {filteredProjects.length === 0 && (
                       <tr>
                         <td colSpan={4} className="px-6 py-16 text-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
                           {t[lang].empty}
                         </td>
                       </tr>
                     )}
                   </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
       </div>

       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0C0C0C] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className={`p-6 border-b border-white/5 flex justify-between items-center bg-black/40 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-lg font-black uppercase text-white tracking-widest">{t[lang].addProjectModalTitle}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Project Name" value={formData.project_name} onChange={e => setFormData((p: Partial<CRMProject>) => ({...p, project_name: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
              <select value={formData.client_id} onChange={e => setFormData((p: Partial<CRMProject>) => ({...p, client_id: Number(e.target.value)}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet">
                 <option value={0}>-- Select Assigned Client --</option>
                 {crmClients.map((c: CRMClient) => (
                   <option key={c.id} value={c.id}>{c.brand_company || c.name}</option>
                 ))}
              </select>
              <textarea placeholder="Description / Requirements" value={formData.description} onChange={e => setFormData((p: Partial<CRMProject>) => ({...p, description: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet min-h-[100px]" />
              <input type="text" placeholder="Budget Estimate" value={formData.budget} onChange={e => setFormData((p: Partial<CRMProject>) => ({...p, budget: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
            </div>
            <div className={`p-6 border-t border-white/5 flex gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button onClick={handleSave} className="flex-1 py-3 font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-white/90 rounded-xl transition">
                {t[lang].save}
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 font-black text-xs uppercase tracking-widest bg-white/5 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition border border-white/10">
                {t[lang].cancel}
              </button>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};
