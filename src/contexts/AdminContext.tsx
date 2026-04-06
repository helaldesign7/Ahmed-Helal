import React, { useState, useEffect, useCallback } from 'react';
import { content as initialContent, type Content } from '../data/content';
import { supabase } from '../lib/supabase';
import type { 
  Project, Lead, Appearance, SectionId, SectionBlueprint,
  Notification, MediaAsset, AdminConfig, SystemStats,
  CRMClient, CRMProject, ActivityLog, ChatConversation, ChatMessage,
  ProjectTask, ProjectNote, ProjectLink, ProjectActivity
} from '../types/admin';

import { defaultBlueprint } from '../types/admin';
import { AdminContext } from './useAdmin';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // --- 1. Master States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [crmClients, setCrmClients] = useState<CRMClient[]>([]);
  const [crmProjects, setCrmProjects] = useState<CRMProject[]>([]);
  const [appearance, setAppearance] = useState<Appearance>({
    accentColor: '#8b5cf6',
    bgColor: '#000000',
    coreGlow: 'rgba(139, 92, 246, 0.5)',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    glassmorphism: true
  });
  const [config, setConfig] = useState<AdminConfig>({
    ai: {
      assistantName: 'A.U.R.A',
      welcomeMessageEn: 'SYSTEM ONLINE. Welcome back, Ahmed. I am AURA. How may I assist you today?',
      welcomeMessageAr: 'النظام متاح. مرحباً بعودتك، أحمد. أنا أورا. كيف يمكنني مساعدتك اليوم؟',
      tone: 'Professional/Tech',
      systemPrompt: '',
      knowledgeBase: '',
      autoSuggest: true,
      leadCaptureEnforcement: true,
      lastUpdatedAt: new Date().toISOString()
    }
  });
  const [siteContent, setSiteContent] = useState<Content>(initialContent);
  const [sections, setSections] = useState<SectionBlueprint[]>(defaultBlueprint);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 2. Data Fetching ---
  const fetchGlobalData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[AdminContext] Starting secure data fetch sequence...');

      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        if (data) setActivityLogs(data as ActivityLog[]);
      } catch (err) {
        console.warn('[AdminContext] Activity logs fetch error:', err);
      }

      // 1. Projects
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('displayorder', { ascending: true });
        if (error) throw error;
        if (data) setProjects(data as Project[]);
      } catch (err) {
        console.warn('[AdminContext] Projects fetch error:', err);
      }

      // 2. Leads
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        if (data) setLeads(data as Lead[]);
      } catch (err) {
        console.warn('[AdminContext] Leads fetch error:', err);
      }

      // 3. CRM Clients & Projects
      try {
        const [{ data: clients }, { data: crmProjs }] = await Promise.all([
          supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
          supabase.from('crm_projects').select('*').order('created_at', { ascending: false })
        ]);
        if (clients) setCrmClients(clients as CRMClient[]);
        if (crmProjs) setCrmProjects(crmProjs as CRMProject[]);
      } catch (err) {
        console.warn('[AdminContext] CRM fetch error:', err);
      }

      // 4. Site Settings (Critical Content)
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'global')
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.content) {
          const s = data.content;
          if (s.appearance) setAppearance(prev => ({ ...prev, ...s.appearance }));
          if (s.config) setConfig(prev => ({ ...prev, ...s.config }));
          if (s.siteContent) {
            setSiteContent(prev => {
              const merged = { ...prev };
              Object.entries(s.siteContent).forEach(([key, value]) => {
                const sectionKey = key as keyof Content;
                if (!value) return;

                if (Array.isArray(value)) {
                  (merged as Record<string, unknown>)[sectionKey] = value;
                } else if (typeof value === 'object' && prev[sectionKey]) {
                  (merged as Record<string, unknown>)[sectionKey] = { 
                    ...(prev[sectionKey] as object), 
                    ...(value as object) 
                  };
                } else {
                  (merged as Record<string, unknown>)[sectionKey] = value;
                }
              });
              return merged;
            });
          }
          if (s.sections) setSections(s.sections);
        }
      } catch (err) {
        console.error('[AdminContext] Critical Settings failed:', err);
      }
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  // --- 3. Logging Helper ---
  const logActivity = useCallback(async (action: string, targetType: string, targetId?: string, details?: Record<string, unknown>) => {
    try {
      const { error } = await supabase.from('activity_logs').insert({
        action,
        target_type: targetType,
        target_id: targetId?.toString(),
        details: details || {}
      });
      if (error) throw error;
    } catch (err) {
      console.error("Log Activity Failed:", err);
    }
  }, []);

  // --- 4. Persistence & Sync ---
  const syncSettings = useCallback(async (overrides?: {
    appearance?: Appearance;
    config?: AdminConfig;
    siteContent?: Content;
    sections?: SectionBlueprint[];
  }) => {
    const payload = {
      appearance: overrides?.appearance || appearance,
      config: overrides?.config || config,
      siteContent: overrides?.siteContent || siteContent,
      sections: overrides?.sections || sections
    };

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          content: payload,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;
      console.log("[AdminContext] Global Sync Success");
    } catch (err) {
      console.error("[AdminContext] Global Sync Failed:", err);
    }
  }, [appearance, config, siteContent, sections]);

  const toggleVisibility = async (id: SectionId) => {
    setSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
      syncSettings({ sections: updated });
      logActivity('update', 'section_visibility', id);
      return updated;
    });
  };

  const toggleNavbarVisibility = async (id: SectionId) => {
    setSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, inNavbar: !s.inNavbar } : s);
      syncSettings({ sections: updated });
      logActivity('update', 'section_navbar', id);
      return updated;
    });
  };

  const moveSection = async (id: SectionId, direction: 'up' | 'down') => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      
      const final = updated.map((s, i) => ({ ...s, order: i }));
      syncSettings({ sections: final });
      logActivity('reorder', 'section_move', id);
      return final;
    });
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    setSections(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const ordered = result.map((s, i) => ({ ...s, order: i }));
      syncSettings({ sections: ordered });
      logActivity('reorder', 'sections_dnd');
      return ordered;
    });
  };

  const setSectionsOrder = async (newSections: SectionBlueprint[]) => {
    const final = newSections.map((s, i) => ({ ...s, order: i }));
    setSections(final);
    await syncSettings({ sections: final });
  };

  const updateSectionLabel = (id: SectionId, labels: { en: string; ar: string }) => {
    setSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, navLabel: labels } : s);
      syncSettings({ sections: updated });
      logActivity('update', 'section_label', id, labels);
      return updated;
    });
  };

  // --- 5. CRUD Operations ---
  
  // Projects
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase.from('projects').insert([project]).select();
      if (error) throw error;
      if (data) {
        setProjects(prev => [data[0] as Project, ...prev]);
        logActivity('create', 'project', data[0].id.toString(), { title: data[0].title });
      }
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      logActivity('update', 'project', id.toString(), updates);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      logActivity('delete', 'project', id.toString());
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const { data, error } = await supabase.from('leads').insert([lead]).select();
      if (error) throw error;
      if (data) {
        setLeads(prev => [data[0] as Lead, ...prev]);
        logActivity('create', 'lead', data[0].id.toString(), { name: data[0].name });
      }
    } catch (err) {
      console.error("Error adding lead:", err);
    }
  };

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      // Optimistic locally
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
      const { error } = await supabase.from('leads').update(updates).eq('id', id);
      if (error) throw error;
      logActivity('update', 'lead', id.toString(), updates);
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const deleteLead = async (id: number) => {
    try {
      setLeads(prev => prev.filter(l => l.id !== id));
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      logActivity('delete', 'lead', id.toString());
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // CRM Clients
  const addCrmClient = async (client: Omit<CRMClient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase.from('crm_clients').insert([{ ...client, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select().single();
      if (error) throw error;
      if (data) {
        setCrmClients(prev => [data as CRMClient, ...prev]);
        logActivity('create', 'client', data.id.toString(), { name: data.name });
      }
    } catch (err) {
      console.error("Error adding CRM client:", err);
    }
  };

  const updateCrmClient = async (id: number, updates: Partial<CRMClient>) => {
    try {
      setCrmClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
      const { error } = await supabase.from('crm_clients').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      logActivity('update', 'client', id.toString(), updates);
    } catch (err) {
      console.error("Error updating CRM client:", err);
    }
  };

  const deleteCrmClient = async (id: number) => {
    try {
      setCrmClients(prev => prev.filter(c => c.id !== id));
      const { error } = await supabase.from('crm_clients').delete().eq('id', id);
      if (error) throw error;
      logActivity('delete', 'client', id.toString());
    } catch (err) {
      console.error("Error deleting CRM client:", err);
    }
  };

  // CRM Projects
  const addCrmProject = async (project: Omit<CRMProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase.from('crm_projects').insert([{ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select().single();
      if (error) throw error;
      if (data) {
        setCrmProjects(prev => [data as CRMProject, ...prev]);
        logActivity('create', 'crm_project', data.id.toString(), { name: data.project_name });
      }
    } catch (err) {
      console.error("Error adding CRM project:", err);
    }
  };

  const updateCrmProject = async (id: number, updates: Partial<CRMProject>) => {
    try {
      setCrmProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
      const { error } = await supabase.from('crm_projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      logActivity('update', 'crm_project', id.toString(), updates);
    } catch (err) {
      console.error("Error updating CRM project:", err);
    }
  };

  const deleteCrmProject = async (id: number) => {
    try {
      setCrmProjects(prev => prev.filter(p => p.id !== id));
      const { error } = await supabase.from('crm_projects').delete().eq('id', id);
      if (error) throw error;
      logActivity('delete', 'crm_project', id.toString());
    } catch (err) {
      console.error("Error deleting CRM project:", err);
    }
  };

  const reorderCrmProjects = async (projectId: number, newIndex: number) => {
    setCrmProjects(prev => {
      const sorted = [...prev].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      const oldIndex = sorted.findIndex(p => p.id === projectId);
      if (oldIndex === -1) return prev;
      
      const [removed] = sorted.splice(oldIndex, 1);
      sorted.splice(newIndex, 0, removed);
      
      const updated = sorted.map((p, i) => ({ ...p, display_order: i }));
      
      Promise.all(updated.map(p => supabase.from('crm_projects').update({ display_order: p.display_order, updated_at: new Date().toISOString() }).eq('id', p.id)))
        .then(() => logActivity('reorder', 'crm_projects'))
        .catch(err => console.error("Error syncing CRM project reorder:", err));
        
      return updated;
    });
  };

  // --- Project Workspace Sub-resources (Phase 10) ---
  const fetchProjectData = useCallback(async (projectId: number) => {
    const [
      { data: tasks },
      { data: notes },
      { data: links },
      { data: activities }
    ] = await Promise.all([
      supabase.from('project_tasks').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),
      supabase.from('project_notes').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
      supabase.from('project_links').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
      supabase.from('project_activities').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
    ]);

    return {
      tasks: (tasks || []) as ProjectTask[],
      notes: (notes || []) as ProjectNote[],
      links: (links || []) as ProjectLink[],
      activities: (activities || []) as ProjectActivity[]
    };
  }, []);

  const addTask = async (task: Omit<ProjectTask, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('project_tasks').insert([task]).select().single();
      if (error) throw error;
      await logProjectActivity(task.project_id, 'create_task', { title: task.title });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTask = async (id: string, updates: Partial<ProjectTask>) => {
    try {
      const { data: task } = await supabase.from('project_tasks').select('project_id, title').eq('id', id).single();
      const { error } = await supabase.from('project_tasks').update(updates).eq('id', id);
      if (error) throw error;
      if (task) await logProjectActivity(task.project_id, 'update_task', { title: task.title, ...updates });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { data: task } = await supabase.from('project_tasks').select('project_id, title').eq('id', id).single();
      const { error } = await supabase.from('project_tasks').delete().eq('id', id);
      if (error) throw error;
      if (task) await logProjectActivity(task.project_id, 'delete_task', { title: task.title });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const addNote = async (note: Omit<ProjectNote, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('project_notes').insert([note]);
      if (error) throw error;
      await logProjectActivity(note.project_id, 'add_note');
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { data: note } = await supabase.from('project_notes').select('project_id').eq('id', id).single();
      const { error } = await supabase.from('project_notes').delete().eq('id', id);
      if (error) throw error;
      if (note) await logProjectActivity(note.project_id, 'delete_note');
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const addLink = async (link: Omit<ProjectLink, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('project_links').insert([link]);
      if (error) throw error;
      await logProjectActivity(link.project_id, 'add_link', { label: link.label });
    } catch (err) {
      console.error("Error adding link:", err);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { data: link } = await supabase.from('project_links').select('project_id, label').eq('id', id).single();
      const { error } = await supabase.from('project_links').delete().eq('id', id);
      if (error) throw error;
      if (link) await logProjectActivity(link.project_id, 'delete_link', { label: link.label });
    } catch (err) {
      console.error("Error deleting link:", err);
    }
  };

  const logProjectActivity = async (projectId: number, action: string, details?: Record<string, unknown>) => {
    try {
      await supabase.from('project_activities').insert({
        project_id: projectId,
        action,
        details: details || {}
      });
    } catch (err) {
      console.error("Log Project Activity Failed:", err);
    }
  };

  // --- 6. Chat Persistence Helpers ---
  const fetchConversations = async () => {
    const { data, error } = await supabase.from('chat_conversations').select('*').order('last_message_at', { ascending: false });
    if (!error && data) setConversations(data as ChatConversation[]);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase.from('chat_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    if (error) throw error;
    return data as ChatMessage[];
  };

  // --- 7. Content Managers ---
  const updateText = (section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => {
    setSiteContent(prev => {
      const newContent = { ...prev };
      const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
      
      const keys = fieldPath.split('.');
      let current: Record<string, unknown> = sectionData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }
      
      if (lang === 'raw') {
        current[keys[keys.length - 1]] = newValue;
      } else {
        (current[keys[keys.length - 1]] as Record<string, string>)[lang] = newValue;
      }
      
      (newContent[section] as unknown) = sectionData;
      syncSettings({ siteContent: newContent });
      logActivity('update', 'site_content', section, { field: fieldPath, newValue });
      return newContent;
    });
  };

  const updateSectionArray = (section: keyof Content, fieldPath: string, newArray: unknown[]) => {
    setSiteContent(prev => {
      const newContent = { ...prev };
      const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
      
      const keys = fieldPath.split('.');
      let current: Record<string, unknown> = sectionData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }
      
      current[keys[keys.length - 1]] = newArray;
      (newContent[section] as unknown) = sectionData;
      syncSettings({ siteContent: newContent });
      logActivity('update', 'site_content_array', section, { field: fieldPath });
      return newContent;
    });
  };

  // --- 6. Supporting States ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    visits: 2450,
    activeUsers: 142,
    uptime: '99.9%',
    load: 12
  });

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);


  const updateAiConfig = async (updates: Partial<AdminConfig['ai']>) => {
    const newAi = { 
      ...config.ai, 
      ...updates, 
      lastUpdatedAt: new Date().toISOString() 
    };
    const newConfig = { ...config, ai: newAi };
    
    // Update local state
    setConfig(newConfig);
    
    // Persist to Supabase
    await syncSettings({ config: newConfig });
    
    // Log activity
    logActivity('update', 'ai_config', 'global', updates);
  };

  const reorderProjects = async (projectId: number, newIndex: number) => {
    setProjects(prev => {
      // Create new sorted array
      const sorted = [...prev].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      const oldIndex = sorted.findIndex(p => p.id === projectId);
      if (oldIndex === -1) return prev;
      
      const [removed] = sorted.splice(oldIndex, 1);
      sorted.splice(newIndex, 0, removed);
      
      // Update displayOrder for all and return
      const updated = sorted.map((p, i) => ({ ...p, displayOrder: i }));
      
      // Background Sync to Supabase
      Promise.all(updated.map(p => supabase.from('projects').update({ displayOrder: p.displayOrder }).eq('id', p.id)))
        .then(() => logActivity('reorder', 'projects'))
        .catch(err => console.error("Error syncing project reorder:", err));
        
      return updated;
    });
  };

  // --- 8. Media Library Actions (Phase 9D) ---
  const uploadMedia = async (file: File, metadata?: { category?: string; alt_text?: string; title?: string }): Promise<MediaAsset> => {
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED_TYPES = [
      'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 
      'video/mp4', 'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > MAX_SIZE) throw new Error("File too large. Max 15MB allowed.");
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error(`File type ${file.type} not allowed.`);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_media')
        .getPublicUrl(filePath);

      const newAsset: Omit<MediaAsset, 'id' | 'created_at'> = {
        filename: file.name,
        storage_path: filePath,
        full_url: publicUrl,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        mime_type: file.type,
        size_bytes: file.size,
        source: 'upload',
        category: metadata?.category || 'General',
        alt_text: metadata?.alt_text || '',
        title: metadata?.title || file.name,
        tags: []
      };

      const { data: dbAsset, error: dbError } = await supabase
        .from('media_assets')
        .insert(newAsset)
        .select()
        .single();

      if (dbError) throw dbError;

      const result = dbAsset as MediaAsset;
      setMediaAssets(prev => [result, ...prev]);
      logActivity('upload', 'media_asset', result.id, { filename: file.name });
      return result;
    } catch (err) {
      console.error("Upload Error:", err);
      throw err;
    }
  };

  const deleteMedia = async (assetId: string) => {
    try {
      const asset = mediaAssets.find(a => a.id === assetId);
      if (!asset) return;

      if (asset.source === 'upload') {
        const { error: storageError } = await supabase.storage
          .from('portfolio_media')
          .remove([asset.storage_path]);
        if (storageError) console.warn("Storage deletion warning:", storageError);
      }

      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId);

      if (dbError) throw dbError;

      setMediaAssets(prev => prev.filter(a => a.id !== assetId));
      logActivity('delete', 'media_asset', assetId, { filename: asset.filename });
    } catch (err) {
      console.error("Delete Media Error:", err);
      throw err;
    }
  };

  const updateStats = (newStats: Partial<SystemStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <AdminContext.Provider value={{
      projects, setProjects,
      leads, setLeads,
      addProject, updateProject, deleteProject,
      addLead, updateLead, deleteLead,
      crmClients, setCrmClients,
      addCrmClient, updateCrmClient, deleteCrmClient,
      crmProjects, setCrmProjects,
      addCrmProject, updateCrmProject, deleteCrmProject, reorderCrmProjects,
      appearance, setAppearance,
      config, setConfig,
      siteContent, updateText, updateSectionArray,
      sections, notifications, setNotifications,
      mediaAssets, setMediaAssets, 
      loading, uploadMedia, deleteMedia,
      markNotificationAsRead, clearNotifications,
      syncSettings, toggleVisibility, toggleNavbarVisibility, moveSection, reorderSections, setSectionsOrder, updateSectionLabel, reorderProjects,
      stats, updateStats,
      activityLogs, logActivity,
      conversations, fetchConversations, fetchMessages, updateAiConfig,
      fetchProjectData, addTask, updateTask, deleteTask, addNote, deleteNote, addLink, deleteLink, logProjectActivity
    }}>
      {!loading && children}
      {loading && (
        <div className="fixed inset-0 z-9999 bg-primary-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-t-2 border-accent-violet rounded-full animate-spin" />
            <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest animate-pulse">Establishing Secure Cloud Sync...</p>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
};
