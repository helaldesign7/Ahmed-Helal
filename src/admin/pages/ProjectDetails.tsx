import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Layout, CheckCircle2, MessageSquare, 
  Link as LinkIcon, Activity, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';
import type { 
  CRMProject, ProjectTask, ProjectNote, 
  ProjectLink, ProjectActivity 
} from '../../types/admin';

// Sub-components
import { WorkspaceTasks } from './workspace/ProjectTasks';
import { WorkspaceNotes } from './workspace/ProjectNotes';
import { WorkspaceLinks } from './workspace/ProjectLinks';
import { WorkspaceTimeline } from './workspace/ProjectTimeline';
import { WorkspaceOverview } from './workspace/ProjectOverview';

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crmProjects, crmClients, fetchProjectData, updateCrmProject } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notes' | 'links' | 'timeline'>('overview');
  const [project, setProject] = useState<CRMProject | null>(null);
  const [client, setClient] = useState<any>(null);
  
  const [data, setData] = useState<{
    tasks: ProjectTask[];
    notes: ProjectNote[];
    links: ProjectLink[];
    activities: ProjectActivity[];
  }>({
    tasks: [],
    notes: [],
    links: [],
    activities: []
  });

  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const proj = crmProjects.find(p => p.id === parseInt(id));
      if (!proj) {
        navigate('/admin/crm');
        return;
      }
      setProject(proj);
      
      const cl = crmClients.find(c => c.id === proj.client_id);
      setClient(cl);

      const res = await fetchProjectData(parseInt(id));
      setData(res);
    } catch (err) {
      console.error("Load Project Data Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id, crmProjects, crmClients, fetchProjectData, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-accent-violet rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, count: data.tasks.length },
    { id: 'notes', label: 'Notes', icon: MessageSquare, count: data.notes.length },
    { id: 'links', label: 'Links', icon: LinkIcon, count: data.links.length },
    { id: 'timeline', label: 'Timeline', icon: Activity }
  ];

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    on_hold: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/crm')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight truncate">{project.project_name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${statusColors[project.status]}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-white/40 text-sm mt-1 truncate">
              Client: <span className="text-white/70">{client?.name || 'Unknown'}</span> • Budget: <span className="text-white/70">${project.budget}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select 
            value={project.status}
            onChange={(e) => updateCrmProject(project.id, { status: e.target.value as any })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent-violet/50 transition-all cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-accent-violet' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-accent-violet/20' : 'bg-white/5'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-violet"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pb-10"
          >
            {activeTab === 'overview' && (
              <WorkspaceOverview project={project} client={client} stats={data} />
            )}
            {activeTab === 'tasks' && (
              <WorkspaceTasks projectId={project.id} initialTasks={data.tasks} onUpdate={loadData} />
            )}
            {activeTab === 'notes' && (
              <WorkspaceNotes projectId={project.id} initialNotes={data.notes} onUpdate={loadData} />
            )}
            {activeTab === 'links' && (
              <WorkspaceLinks projectId={project.id} initialLinks={data.links} onUpdate={loadData} />
            )}
            {activeTab === 'timeline' && (
              <WorkspaceTimeline activities={data.activities} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
