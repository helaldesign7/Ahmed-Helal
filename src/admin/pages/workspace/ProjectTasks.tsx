import { useState } from 'react';
import { 
  CheckCircle2, Circle, Clock, Plus, Trash2, 
  MoreVertical, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../../contexts/useAdmin';
import type { ProjectTask } from '../../../types/admin';

interface WorkspaceTasksProps {
  projectId: number;
  initialTasks: ProjectTask[];
  onUpdate: () => void;
}

export const WorkspaceTasks = ({ projectId, initialTasks, onUpdate }: WorkspaceTasksProps) => {
  const { addTask, updateTask, deleteTask } = useAdmin();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask({
      project_id: projectId,
      title: newTaskTitle,
      status: 'todo'
    });
    
    setNewTaskTitle('');
    setShowAddForm(false);
    onUpdate();
  };

  const toggleTaskStatus = async (task: ProjectTask) => {
    const nextStatus: Record<string, string> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo'
    };
    await updateCrmTaskStatus(task.id, nextStatus[task.status] as any);
    onUpdate();
  };

  const updateCrmTaskStatus = async (id: string, status: ProjectTask['status']) => {
    await updateTask(id, { status });
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Delete this task?")) {
      await deleteTask(id);
      onUpdate();
    }
  };

  const groups = [
    { id: 'todo', label: 'To Do', icon: Circle, color: 'text-white/40' },
    { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-blue-400' },
    { id: 'done', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Task Creation Bar */}
      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 rounded-2xl border border-dashed border-white/10 hover:border-accent-violet/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/40 group text-sm font-medium"
        >
          <Plus className="w-5 h-5 group-hover:text-accent-violet transition-colors" />
          <span className="group-hover:text-white transition-colors">Create a New Task</span>
        </button>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddTask}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-accent-violet/10">
            <Plus className="w-5 h-5 text-accent-violet" />
          </div>
          <input 
            autoFocus
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20"
          />
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-4 py-1.5 bg-accent-violet hover:bg-accent-violet-dark rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </motion.form>
      )}

      {/* Task Lists Grouped by Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groups.map((group) => {
          const tasks = initialTasks.filter(t => t.status === group.id);
          
          return (
            <div key={group.id} className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <group.icon className={`w-4 h-4 ${group.color}`} />
                  <h3 className="text-sm font-bold tracking-tight">{group.label}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40 font-bold">{tasks.length}</span>
                </div>
                <button className="p-1 hover:bg-white/5 rounded-md transition-colors group">
                  <MoreVertical className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                </button>
              </div>

              <div className="space-y-3 min-h-[100px]">
                {tasks.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                    <p className="text-[10px] uppercase font-bold tracking-widest">No Tasks</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {tasks.map((task) => (
                      <motion.div
                        layout
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-violet/30 hover:bg-white/10 transition-all cursor-pointer relative"
                        onClick={() => toggleTaskStatus(task)}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className={`mt-0.5 transition-colors ${
                              task.status === 'done' ? 'text-emerald-400' : 'text-white/20 group-hover:text-white/60'
                            }`}
                          >
                            {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium leading-tight ${task.status === 'done' ? 'line-through text-white/20' : 'text-white/80'}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-2">
                              {task.due_date && (
                                <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-tighter">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] text-white/20 truncate">
                                <Clock className="w-3 h-3" />
                                Added {new Date(task.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
