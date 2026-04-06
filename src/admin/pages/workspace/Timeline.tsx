import { 
  Activity, Clock, 
  MessageSquare, Plus, Trash2, Edit2, Link as LinkIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { ProjectActivity } from '../../../types/admin';

interface WorkspaceTimelineProps {
  activities: ProjectActivity[];
}

export const WorkspaceTimeline = ({ activities }: WorkspaceTimelineProps) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create_task': return <Plus className="w-4 h-4 text-accent-violet" />;
      case 'update_task': return <Edit2 className="w-4 h-4 text-blue-400" />;
      case 'delete_task': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'add_note': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'delete_note': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'add_link': return <LinkIcon className="w-4 h-4 text-accent-violet" />;
      case 'delete_link': return <Trash2 className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-white/40" />;
    }
  };

  const getActionLabel = (activity: ProjectActivity) => {
    const details = (activity.details || {}) as Record<string, string | number | undefined>;
    switch (activity.action) {
      case 'create_task': return `Task Created: "${details.title}"`;
      case 'update_task': 
        if (details.status) return `Task Moved to ${(details.status as string).replace('_', ' ')}: "${details.title}"`;
        return `Task Updated: "${details.title}"`;
      case 'delete_task': return `Task Deleted: "${details.title}"`;
      case 'add_note': return `Internal Note Added`;
      case 'delete_note': return `Internal Note Removed`;
      case 'add_link': return `External Link Linked: "${details.label}"`;
      case 'delete_link': return `External Link Removed: "${details.label}"`;
      default: return activity.action.replace('_', ' ');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-violet/10">
            <Activity className="w-5 h-5 text-accent-violet" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Project Timeline & Audit</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Historical Activity Feed</p>
          </div>
        </div>
      </div>

      <div className="relative pl-8 space-y-10">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-linear-to-b from-accent-violet/40 via-white/5 to-transparent" />

        {activities.length === 0 ? (
          <div className="py-20 text-center space-y-4 opacity-30">
            <Clock className="w-8 h-8 mx-auto" />
            <p className="text-xs italic">No activity logged yet.</p>
          </div>
        ) : (
          activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-start gap-6 group"
            >
              {/* Dot */}
              <div className="absolute left-[-23px] top-1.5 w-3 h-3 rounded-full border-2 border-accent-violet bg-primary-black z-10 
                            group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
              
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-accent-violet/20 group-hover:bg-white/8 transition-all">
                {getActionIcon(activity.action)}
              </div>

              <div className="flex-1 space-y-1 pt-1">
                <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors capitalize">
                  {getActionLabel(activity)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
                    {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[10px] text-white/20">
                    {new Date(activity.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
