import { useState } from 'react';
import { 
  Trash2, Clock, MessageSquare, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../../contexts/useAdmin';
import type { ProjectNote } from '../../../types/admin';

interface WorkspaceNotesProps {
  projectId: number;
  initialNotes: ProjectNote[];
  onUpdate: () => void;
}

export const WorkspaceNotes = ({ projectId, initialNotes, onUpdate }: WorkspaceNotesProps) => {
  const { addNote, deleteNote } = useAdmin();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    await addNote({
      project_id: projectId,
      content: newNoteContent
    });
    setNewNoteContent('');
    setIsAdding(false);
    onUpdate();
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("Delete this note?")) {
      await deleteNote(id);
      onUpdate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Note Creation Area */}
      <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 transition-all ${isAdding ? 'ring-1 ring-accent-violet/30 bg-white/[0.07]' : ''}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-accent-violet/10">
            <MessageSquare className="w-5 h-5 text-accent-violet" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Project Discussions & Notes</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Internal Coordination</p>
          </div>
        </div>

        <textarea
          rows={isAdding ? 6 : 1}
          placeholder="Type your note here... (Project update, client feedback, next steps)"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onFocus={() => setIsAdding(true)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50 focus:bg-white/8 transition-all resize-none custom-scrollbar"
        />

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between mt-4 overflow-hidden"
          >
            <div className="flex items-center gap-4 text-[10px] text-white/30 font-medium tracking-wide">
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Auto-saved</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Admin Visible Only</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteContent('');
                }}
                className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-accent-violet hover:bg-accent-violet-dark disabled:opacity-30 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-accent-violet/20"
              >
                <Save className="w-3.5 h-3.5" />
                Save Note
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notes Feed */}
      <div className="space-y-6">
        {initialNotes.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 text-white/10">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-white/20 text-sm italic font-medium tracking-wide">No internal notes yet. Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence>
            {initialNotes.map((note) => (
              <motion.div
                layout
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-accent-violet/20 hover:bg-white/[0.07] transition-all relative"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-violet/20 flex items-center justify-center text-accent-violet font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white/80">Ahmed Helal</div>
                      <div className="text-[9px] text-white/30 flex items-center gap-1.5 mt-0.5 uppercase tracking-widest font-bold">
                        <Clock className="w-3 h-3" />
                        {new Date(note.created_at).toLocaleString('en-US', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pl-11 pr-2">
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-book">
                    {note.content}
                  </p>
                </div>

                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/10">
                      Private Log
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
