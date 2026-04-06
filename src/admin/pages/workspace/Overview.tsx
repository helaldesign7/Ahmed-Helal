import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, DollarSign, 
  Tag, Info, ExternalLink, Briefcase, FileText
} from 'lucide-react';
import type { CRMProject, CRMClient } from '../../../types/admin';

interface WorkspaceOverviewProps {
  project: CRMProject;
  client: CRMClient | null;
  stats: {
    tasks: any[];
    notes: any[];
    links: any[];
  };
}

export const WorkspaceOverview = ({ project, client, stats }: WorkspaceOverviewProps) => {
  const infoCards = [
    { label: 'Client', value: client?.name || 'N/A', icon: User, sub: client?.brand_company },
    { label: 'Budget', value: `$${project.budget}`, icon: DollarSign, sub: `Paid: $${project.paid_amount}` },
    { label: 'Due Date', value: project.due_date || 'No Date Set', icon: Calendar, sub: 'Projected completion' },
    { label: 'Priority', value: project.priority.toUpperCase(), icon: Tag, sub: 'Execution order' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Quick Stats Grid */}
      {infoCards.map((card, idx) => (
        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-violet/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-violet/10">
              <card.icon className="w-5 h-5 text-accent-violet" />
            </div>
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{card.label}</span>
          </div>
          <div className="text-xl font-bold">{card.value}</div>
          <div className="text-white/30 text-[10px] mt-1">{card.sub}</div>
        </div>
      ))}

      {/* Main Details & Description */}
      <div className="md:col-span-3 space-y-6">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent-violet/10">
              <FileText className="w-6 h-6 text-accent-violet" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Project Scope & Description</h3>
              <p className="text-white/40 text-xs">Core objectives and project brief</p>
            </div>
          </div>
          <p className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">
            {project.description || "No description provided."}
          </p>
          
          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent-violet" />
                Requirements
              </h4>
              <p className="text-white/60 text-sm whitespace-pre-wrap">
                {project.requirements || "Standard delivery requirements."}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent-violet" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white/80 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Sidebar Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-accent-violet" />
            Client Profile
          </h3>
          {client ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                <div className="w-12 h-12 rounded-full bg-accent-violet/20 flex items-center justify-center text-accent-violet font-bold text-lg">
                  {client.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{client.name}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">{client.brand_company}</div>
                </div>
              </div>
              
              <div className="space-y-1 mt-6">
                <a href={`mailto:${client.email}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <Mail className="w-4 h-4 text-white/20 group-hover:text-accent-violet" />
                  <span className="text-xs text-white/60 group-hover:text-white truncate">{client.email}</span>
                </a>
                <a href={`https://wa.me/${client.phone_whatsapp}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group text-emerald-400">
                  <Phone className="w-4 h-4 text-emerald-400/30 group-hover:text-emerald-400" />
                  <span className="text-xs group-hover:text-emerald-300 truncate tracking-tight">{client.phone_whatsapp}</span>
                </a>
              </div>
              
              <button className="w-full mt-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-xs font-medium flex items-center justify-center gap-2">
                View Full CRM Record
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-white/20 text-xs italic">No client assigned.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
