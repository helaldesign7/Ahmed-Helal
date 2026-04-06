import { useState } from 'react';
import { 
  Link as LinkIcon, ExternalLink, Plus, Trash2, 
  Globe, Link2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../../contexts/useAdmin';
import type { ProjectLink } from '../../../types/admin';

interface WorkspaceLinksProps {
  projectId: number;
  initialLinks: ProjectLink[];
  onUpdate: () => void;
}

export const WorkspaceLinks = ({ projectId, initialLinks, onUpdate }: WorkspaceLinksProps) => {
  const { addLink, deleteLink } = useAdmin();
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState('Figma');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    
    await addLink({
      project_id: projectId,
      label: newLinkLabel,
      url: newLinkUrl,
      category: newLinkCategory
    });
    
    setNewLinkLabel('');
    setNewLinkUrl('');
    setIsAdding(false);
    onUpdate();
  };

  const handleDeleteLink = async (id: string) => {
    if (confirm("Remove this link?")) {
      await deleteLink(id);
      onUpdate();
    }
  };

  const getPlatformIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'figma': return <Globe className="w-5 h-5 text-accent-violet" />;
      case 'github': return <Link2 className="w-5 h-5 text-white/60" />;
      case 'notion': return <FileText className="w-5 h-5 text-white/60" />;
      case 'drive': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'behance': return <Globe className="w-5 h-5 text-blue-500" />;
      default: return <LinkIcon className="w-5 h-5 text-white/40" />;
    }
  };

  const categories = ['Figma', 'Notion', 'Google Drive', 'Behance', 'Github', 'Other'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight">External References</h3>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Quick access to project assets</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isAdding ? 'bg-white/10 text-white' : 'bg-accent-violet hover:bg-accent-violet-dark text-white'
          }`}
        >
          <Plus className={`w-4 h-4 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
          {isAdding ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, scale: 0.98, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.98, height: 0 }}
            onSubmit={handleAddLink}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-1">Label</label>
                  <input 
                    autoFocus
                    type="text"
                    placeholder="e.g. Design Prototype (Figma)"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-1">Platform/Category</label>
                  <select 
                    value={newLinkCategory}
                    onChange={(e) => setNewLinkCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-violet/50"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-1">URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="url"
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                  className="px-8 py-2 bg-accent-violet hover:bg-accent-violet-dark rounded-xl text-xs font-bold text-white transition-all disabled:opacity-30 shadow-lg shadow-accent-violet/20"
                >
                  Save Resource
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialLinks.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center space-y-4 border border-dashed border-white/5 rounded-3xl opacity-30">
            <LinkIcon className="w-8 h-8 mx-auto" />
            <p className="text-xs font-medium tracking-wide italic">No external resources linked yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {initialLinks.map((link) => (
              <motion.div
                layout
                key={link.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-violet/30 hover:bg-white/8 transition-all flex items-center gap-4 relative"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-accent-violet/10 transition-colors">
                  {getPlatformIcon(link.category || 'Other')}
                </div>
                <div className="flex-1 min-w-0 pr-10">
                  <h4 className="text-sm font-bold text-white/80 group-hover:text-white truncate">
                    {link.label}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/30 uppercase tracking-tighter font-bold">{link.category || 'Reference'}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] text-white/20 truncate">{new URL(link.url).hostname}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-accent-violet/10 text-accent-violet hover:bg-accent-violet hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 rounded-lg bg-red-400/5 text-red-400/40 hover:bg-red-400 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
