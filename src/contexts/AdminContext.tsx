import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { content as initialContent, type Content } from '../data/content';
import { supabase } from '../lib/supabase';
import type { 
  Project, Lead, Appearance, SectionId, SectionBlueprint,
  Notification, MediaAsset, AdminConfig, SystemStats,
  CRMClient, CRMProject, ActivityLog, ChatConversation, ChatMessage,
  ProjectTask, ProjectNote, ProjectLink, ProjectActivity,
  AdminContextType, WebsiteState
} from '../types/admin';

import { defaultBlueprint } from '../types/admin';
import { AdminContext } from './useAdmin';

type ProjectDbRow = {
  id?: number;
  title: string;
  titlear?: string;
  category: string;
  categoryar?: string;
  status: 'published' | 'archived';
  isfeatured?: boolean;
  date: string;
  featuredmediaurl?: string;
  imageurl?: string;
  content: string;
  displayorder?: number;
  created_at?: string;
};

const mapDbProjectToUi = (row: ProjectDbRow): Project => ({
  id: row.id!,
  title: row.title,
  titleAr: row.titlear || '',
  category: row.category,
  categoryAr: row.categoryar || '',
  status: row.status,
  isFeatured: row.isfeatured || false,
  date: row.date,
  featuredMediaUrl: row.featuredmediaurl || '',
  imageUrl: row.imageurl || '',
  content: row.content,
  displayOrder: row.displayorder ?? 0,
});

const mapUiProjectToDb = (
  project: Omit<Project, 'id'> | Partial<Project>
): Partial<ProjectDbRow> => ({
  title: project.title ?? '',
  titlear: project.titleAr ?? '',
  category: project.category ?? '',
  categoryar: project.categoryAr ?? '',
  status: (project.status as 'published' | 'archived') ?? 'published',
  isfeatured: project.isFeatured ?? false,
  date: project.date ?? '',
  featuredmediaurl: project.featuredMediaUrl ?? '',
  imageurl: project.imageUrl ?? '',
  content: project.content ?? '',
  displayorder: project.displayOrder ?? 0,
});

const initialWebsiteState: WebsiteState = {
  appearance: {
    accentColor: '#8b5cf6',
    bgColor: '#000000',
    coreGlow: 'rgba(139, 92, 246, 0.5)',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    glassmorphism: true
  },
  siteContent: initialContent,
  sections: defaultBlueprint,
  config: {
    ai: {
      assistantName: 'Ahmed\'s Assistant',
      welcomeMessageEn: 'Hey! I\'m Ahmed\'s digital architect. Ready to turn your vision into a cinematic reality? How can I help you today?',
      welcomeMessageAr: 'أهلاً بك! أنا مساعد المبدع أحمد هلال. هل أنت مستعد لتحويل رؤيتك إلى واقع سينمائي مبهر؟ كيف يمكنني مساعدتك اليوم؟',
      tone: 'Creative / Dynamic',
      systemPrompt: 'You are the official AI representative for Ahmed Helal. Your mission is to showcase Ahmed as a top-tier visual designer and convert visitors into clients. Be spontaneous, engaging, and always suggest WhatsApp for deeper discussions.',
      knowledgeBase: 'Ahmed Helal is a multidisciplinary designer specializing in Cinematic UI, 3D Web Experiences, and Branding. He works with global brands and sports clubs like Al Ahly SC.',
      autoSuggest: true,
      leadCaptureEnforcement: true,
      lastUpdatedAt: new Date().toISOString()
    }
  }
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // --- 1. Internal System States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [crmClients, setCrmClients] = useState<CRMClient[]>([]);
  const [crmProjects, setCrmProjects] = useState<CRMProject[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    visits: 2450,
    activeUsers: 142,
    uptime: '99.9%',
    load: 12
  });

  // --- 2. Public Site Draft System ---
  const [websiteDraft, setWebsiteDraft] = useState<WebsiteState>(initialWebsiteState);
  const [persistedWebsiteState, setPersistedWebsiteState] = useState<WebsiteState | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const persistedRef = React.useRef(persistedWebsiteState);
  const draftRef = React.useRef(websiteDraft);
  
  useEffect(() => {
    persistedRef.current = persistedWebsiteState;
    draftRef.current = websiteDraft;
  }, [persistedWebsiteState, websiteDraft]);

  const hasUnsavedChanges = useMemo(() => {
    if (!persistedWebsiteState) return false;
    return JSON.stringify(websiteDraft) !== JSON.stringify(persistedWebsiteState);
  }, [websiteDraft, persistedWebsiteState]);

  const { appearance, siteContent, sections, config } = websiteDraft;

  // --- 3. Data Fetching Logic ---

  const fetchSiteSettingsData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'global')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.content) {
        const s = data.content as Partial<WebsiteState>;

        const newState: WebsiteState = {
          appearance: { ...initialWebsiteState.appearance, ...(s.appearance || {}) },
          config: { ...initialWebsiteState.config, ...(s.config || {}) },
          siteContent: { 
            ...initialWebsiteState.siteContent, 
            ...(s.siteContent || {}),
            // Ensure nested objects like laptop are also merged
            laptop: { 
              ...initialWebsiteState.siteContent.laptop, 
              ...(s.siteContent?.laptop || {}) 
            }
          },
          sections: s.sections || initialWebsiteState.sections
        };

        setPersistedWebsiteState(newState);

        const currentDraftStr = JSON.stringify(draftRef.current);
        const currentPersistedStr = JSON.stringify(persistedRef.current);
        
        // Prevent realtime override if draft was modified locally
        if (!persistedRef.current || currentDraftStr === currentPersistedStr) {
           setWebsiteDraft(newState);
        }
      }
    } catch (err) {
      console.error('[AdminContext] Settings Fetch Failed:', err);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false });
    
    if (error) {
      console.error("fetchConversations error:", error);
      return;
    }
    setConversations(data as ChatConversation[]);
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("fetchMessages error:", error);
      return [];
    }
    return data as ChatMessage[];
  }, []);

  const fetchGlobalData = useCallback(async () => {
    try {
      setLoading(true);
      const [p, l, cClients, cProjs, m, logs] = await Promise.all([
        supabase.from('projects').select('*').order('displayorder', { ascending: true }),
        supabase.from('leads').select('*').order('date', { ascending: false }),
        supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
        supabase.from('crm_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50),
        fetchSiteSettingsData(),
        fetchConversations()
      ]);

      if (p.data) {
        setProjects((p.data as ProjectDbRow[]).map(mapDbProjectToUi));
      }
      if (l.data) setLeads(l.data as Lead[]);
      if (cClients.data) setCrmClients(cClients.data as CRMClient[]);
      if (cProjs.data) setCrmProjects(cProjs.data as CRMProject[]);
      if (m.data) setMediaAssets(m.data as MediaAsset[]);
      if (logs.data) setActivityLogs(logs.data as ActivityLog[]);
    } finally {
      setLoading(false);
    }
  }, [fetchSiteSettingsData, fetchConversations]);

  // --- 4. System Action Helpers ---

  const pushNotification = useCallback((message: string, type: 'lead' | 'system' | 'update' = 'system', title?: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [{
      id,
      title: title || (type === 'system' ? 'System Sync' : 'Update'),
      description: message,
      time: new Date().toLocaleTimeString(),
      type,
      read: false,
      link: '#'
    }, ...prev]);
  }, []);

  useEffect(() => {
    fetchGlobalData();
    
    // Multi-table real-time sync
    const channel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: 'id=eq.global' }, () => {
        fetchSiteSettingsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchGlobalData();
        pushNotification("New Inquiry Received", 'lead', "Lead Capture");
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, () => {
        fetchConversations();
        pushNotification("AI Conversation Updated", 'update', "Live Tracking");
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
        // We only fetch conversations to update activity badges, 
        // specific message updates are handled within ConversationViewer components usually
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchGlobalData, fetchSiteSettingsData, fetchConversations, pushNotification]);

  const logActivity = useCallback(async (action: string, targetType: string, targetId?: string, details?: Record<string, unknown>) => {
    try {
      await supabase.from('activity_logs').insert({
        action,
        target_type: targetType,
        target_id: targetId?.toString(),
        details: details || {}
      });
    } catch (err) { console.error("Log Activity Failed:", err); }
  }, []);

  // --- 5. Working State Setters (Draft System) ---

  const setAppearance = useCallback((updates: Partial<Appearance>) => {
    setWebsiteDraft(prev => ({ ...prev, appearance: { ...prev.appearance, ...updates } }));
  }, []);

  const updateText = useCallback((section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => {
    setWebsiteDraft(prev => {
      const newContent = { ...prev.siteContent };
      const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
      const keys = fieldPath.split('.');
      let current: Record<string, unknown> = sectionData;
      for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]] as Record<string, unknown>; }
      if (lang === 'raw') current[keys[keys.length - 1]] = newValue;
      else (current[keys[keys.length - 1]] as Record<string, string>)[lang] = newValue;
      (newContent[section] as unknown) = sectionData;
      return { ...prev, siteContent: newContent };
    });
  }, []);

  const updateSection = useCallback(<S extends keyof Content>(section: S, newValue: Content[S]) => {
    setWebsiteDraft(prev => ({
      ...prev,
      siteContent: {
        ...prev.siteContent,
        [section]: newValue
      }
    }));
  }, []);

  const updateSectionArray = useCallback((section: keyof Content, fieldPath: string, newArray: unknown[]) => {
    setWebsiteDraft(prev => {
      const newContent = { ...prev.siteContent };
      
      if (!fieldPath) {
        // Direct top-level array update (e.g., socials)
        (newContent[section] as unknown) = newArray;
      } else {
        const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
        const keys = fieldPath.split('.');
        let current: Record<string, unknown> = sectionData;
        for (let i = 0; i < keys.length - 1; i++) { 
          current = current[keys[i]] as Record<string, unknown>; 
        }
        current[keys[keys.length - 1]] = newArray;
        (newContent[section] as unknown) = sectionData;
      }
      
      return { ...prev, siteContent: newContent };
    });
  }, []);

  const toggleVisibility = useCallback((id: SectionId) => {
    setWebsiteDraft(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s) }));
  }, []);

  const toggleNavbarVisibility = useCallback((id: SectionId) => {
    setWebsiteDraft(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, inNavbar: !s.inNavbar } : s) }));
  }, []);

  const moveSection = useCallback((id: SectionId, direction: 'up' | 'down') => {
    setWebsiteDraft(prev => {
      const index = prev.sections.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.sections.length) return prev;
      const updated = [...prev.sections];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      const final = updated.map((s, i) => ({ ...s, order: i }));
      return { ...prev, sections: final };
    });
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setWebsiteDraft(prev => {
      const result = Array.from(prev.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const ordered = result.map((s, i) => ({ ...s, order: i }));
      return { ...prev, sections: ordered };
    });
  }, []);

  const setSectionsOrder = useCallback((newSections: SectionBlueprint[]) => {
    setWebsiteDraft(prev => ({ ...prev, sections: newSections.map((s, i) => ({ ...s, order: i })) }));
  }, []);

  const updateSectionLabel = useCallback((id: SectionId, labels: { en: string; ar: string }) => {
    setWebsiteDraft(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, navLabel: labels } : s) }));
  }, []);

  const setConfig = useCallback((configUpdates: React.SetStateAction<AdminConfig>) => {
    setWebsiteDraft(prev => {
      const nextConfig = typeof configUpdates === 'function' ? configUpdates(prev.config) : configUpdates;
      return { ...prev, config: nextConfig };
    });
  }, []);

  // --- 6. Save/Cancel Draft Flow ---

  const saveWebsiteChanges = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const payload = websiteDraft;
      const { error } = await supabase.from('site_settings').upsert({
        id: 'global', content: payload, updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;

      setPersistedWebsiteState(payload);
      setSaveStatus('saved');
      pushNotification("Changes published & live!", "system", "Site Published");
      setTimeout(() => setSaveStatus('idle'), 3000);
      logActivity('publish', 'site_settings', 'global');
    } catch (error) {
      console.error("Save Changes Failed:", error);
      setSaveStatus('error');
      pushNotification("Failed to publish changes.", "system", "Error");
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  }, [websiteDraft, pushNotification, logActivity]);

  const resetWebsiteChanges = useCallback(() => {
    if (persistedWebsiteState) {
      setWebsiteDraft(persistedWebsiteState);
    }
    setSaveStatus('idle');
    pushNotification("Unsaved changes discarded.", "system");
  }, [persistedWebsiteState, pushNotification]);

  // --- 7. Instant CRUD (CRM, Media, Logs etc.) ---

  const addProject = useCallback(async (project: Omit<Project, 'id'>) => {
    const payload = mapUiProjectToDb(project);
    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Add Project Failed:', error);
      throw error;
    }

    if (data) {
      setProjects(prev => [mapDbProjectToUi(data as ProjectDbRow), ...prev]);
    }
  }, []);
  
  const updateProject = useCallback(async (id: number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const payload = mapUiProjectToDb(updates);
    const { error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Update Project Failed:', error);
      throw error;
    }
  }, []);
  
  const deleteProject = useCallback(async (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  }, []);
  
  const reorderProjects = useCallback(async (id: number, newIndex: number) => {
    setProjects(prev => {
      const result = [...prev].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      const oldIndex = result.findIndex(p => p.id === id);
      if (oldIndex === -1) return prev;
      
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      
      const updated = result.map((p, i) => ({ ...p, displayOrder: i }));
      
      Promise.all(
        updated.map(p =>
          supabase.from('projects').update({ displayorder: p.displayOrder }).eq('id', p.id)
        )
      ).catch(err => console.error('Reorder Projects Failed:', err));
      
      return updated;
    });
  }, []);

  const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
    // Map camelCase to the actual DB columns
    const payload = {
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp,
      company: lead.company,
      interest: lead.interest,
      servicetype: lead.serviceType, // Might be missing, but we'll try lowercase
      projecttitle: lead.projectTitle,
      description: lead.description,
      budget: lead.budget,
      timeline: lead.timeline,
      preferredcontact: lead.preferredContact, // Might be missing
      status: lead.status || 'new',
      date: lead.date,
      source: lead.source
    };
    
    // Purge undefined/missing columns that throw 400
    // Try catching column errors and removing them dynamically if they block insertion
    const { data, error } = await supabase.from('leads').insert([payload]).select();
    
    // If we hit column mismatch, we can fallback to inserting only safe keys
    if (error && error.code === 'PGRST204') {
      console.warn("Retrying lead insert with safe mapped keys...");
      const safePayload = {
        name: lead.name, email: lead.email, whatsapp: lead.whatsapp, 
        company: lead.company, interest: lead.interest, 
        projecttitle: lead.projectTitle, description: lead.description, 
        budget: lead.budget, timeline: lead.timeline, 
        status: lead.status || 'new', date: lead.date
      };
      const retry = await supabase.from('leads').insert([safePayload]).select();
      if (retry.data) setLeads(prev => [retry.data[0] as Lead, ...prev]);
      return;
    }

    if (error) console.error("addLead error:", error);
    if (data) setLeads(prev => [data[0] as Lead, ...prev]);
  }, []);
  const updateLead = useCallback(async (id: number, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    await supabase.from('leads').update(updates).eq('id', id);
  }, []);
  const deleteLead = useCallback(async (id: number) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    await supabase.from('leads').delete().eq('id', id);
  }, []);

  const addCrmClient = useCallback(async (client: Omit<CRMClient, 'id' | 'created_at' | 'updated_at'>) => {
    const { data } = await supabase.from('crm_clients').insert([client]).select().single();
    if (data) setCrmClients(prev => [data as CRMClient, ...prev]);
  }, []);
  const updateCrmClient = useCallback(async (id: number, updates: Partial<CRMClient>) => {
    setCrmClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    await supabase.from('crm_clients').update(updates).eq('id', id);
  }, []);
  const deleteCrmClient = useCallback(async (id: number) => {
    setCrmClients(prev => prev.filter(c => c.id !== id));
    await supabase.from('crm_clients').delete().eq('id', id);
  }, []);
  const addCrmProject = useCallback(async (proj: Omit<CRMProject, 'id' | 'created_at' | 'updated_at'>) => {
    const { data } = await supabase.from('crm_projects').insert([proj]).select().single();
    if (data) setCrmProjects(prev => [data as CRMProject, ...prev]);
  }, []);
  const updateCrmProject = useCallback(async (id: number, updates: Partial<CRMProject>) => {
    setCrmProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('crm_projects').update(updates).eq('id', id);
  }, []);
  const deleteCrmProject = useCallback(async (id: number) => {
    setCrmProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('crm_projects').delete().eq('id', id);
  }, []);
  const reorderCrmProjects = useCallback(async (id: number, newIndex: number) => {
    setCrmProjects(prev => {
      const result = [...prev];
      const oldIndex = result.findIndex(p => p.id === id);
      if (oldIndex === -1) return prev;
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      const updated = result.map((p, i) => ({ ...p, display_order: i }));
      Promise.all(updated.map(p => supabase.from('crm_projects').update({ display_order: p.display_order }).eq('id', p.id)));
      return updated;
    });
  }, []);

  const uploadMedia = useCallback(async (file: File, metadata?: { category?: string; alt_text?: string; title?: string }) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('portfolio_assets').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('portfolio_assets').getPublicUrl(uploadData.path);
    const { data: asset, error: dbError } = await supabase.from('media_assets').insert([{
      filename: file.name,
      storage_path: uploadData.path,
      full_url: publicUrl,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      mime_type: file.type || 'application/octet-stream',
      size_bytes: file.size,
      source: 'upload',
      category: metadata?.category || 'General',
      title: metadata?.title || file.name,
      alt_text: metadata?.alt_text || ''
    }]).select().single();
    if (dbError) throw dbError;
    setMediaAssets(prev => [asset as MediaAsset, ...prev]);
    return asset as MediaAsset;
  }, []);
  const deleteMedia = useCallback(async (id: string) => {
    setMediaAssets(prev => prev.filter(a => a.id === id));
    await supabase.from('media_assets').delete().eq('id', id);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const clearNotifications = useCallback(() => setNotifications([]), []);

  const fetchProjectData = useCallback(async (id: number) => {
    const [t, n, l, a] = await Promise.all([
      supabase.from('project_tasks').select('*').eq('project_id', id).order('created_at', { ascending: true }),
      supabase.from('project_notes').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      supabase.from('project_links').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      supabase.from('project_activities').select('*').eq('project_id', id).order('created_at', { ascending: false })
    ]);
    return { tasks: (t.data || []) as ProjectTask[], notes: (n.data || []) as ProjectNote[], links: (l.data || []) as ProjectLink[], activities: (a.data || []) as ProjectActivity[] };
  }, []);

  const addTask = useCallback(async (t: Omit<ProjectTask, 'id' | 'created_at'>) => { await supabase.from('project_tasks').insert([t]); }, []);
  const updateTask = useCallback(async (id: string, u: Partial<ProjectTask>) => { await supabase.from('project_tasks').update(u).eq('id', id); }, []);
  const deleteTask = useCallback(async (id: string) => { await supabase.from('project_tasks').delete().eq('id', id); }, []);
  const addNote = useCallback(async (n: Omit<ProjectNote, 'id' | 'created_at'>) => { await supabase.from('project_notes').insert([n]); }, []);
  const deleteNote = useCallback(async (id: string) => { await supabase.from('project_notes').delete().eq('id', id); }, []);
  const addLink = useCallback(async (l: Omit<ProjectLink, 'id' | 'created_at'>) => { await supabase.from('project_links').insert([l]); }, []);
  const deleteLink = useCallback(async (id: string) => { await supabase.from('project_links').delete().eq('id', id); }, []);
  const logProjectActivity = useCallback(async (pid: number, act: string, det?: Record<string, unknown>) => { await supabase.from('project_activities').insert({ project_id: pid, action: act, details: det || {} }); }, []);

  // --- 8. Context Provisioning ---

  const updateAiConfig = useCallback(async (u: Partial<AdminConfig['ai']>) => {
    setWebsiteDraft(prev => ({
      ...prev,
      config: {
        ...prev.config,
        ai: { ...prev.config.ai, ...u, lastUpdatedAt: new Date().toISOString() }
      }
    }));
  }, []);

  const updateStats = useCallback((newStats: Partial<SystemStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const value = useMemo<AdminContextType>(() => ({
    projects, setProjects, leads, setLeads, crmClients, setCrmClients, crmProjects, setCrmProjects,
    websiteDraft, persistedWebsiteState, hasUnsavedChanges, saveStatus, saveWebsiteChanges, resetWebsiteChanges,
    appearance, siteContent, sections, config, setConfig,
    loading, mediaAssets, setMediaAssets, notifications, setNotifications, stats, activityLogs, conversations,
    setAppearance, updateText, updateSection, updateSectionArray, toggleVisibility, toggleNavbarVisibility,
    moveSection, reorderSections, setSectionsOrder, updateSectionLabel,
    addProject, updateProject, deleteProject, reorderProjects, addLead, updateLead, deleteLead,
    addCrmClient, updateCrmClient, deleteCrmClient, addCrmProject, updateCrmProject, deleteCrmProject, reorderCrmProjects,
    uploadMedia, deleteMedia, markNotificationAsRead, clearNotifications, fetchProjectData,
    addTask, updateTask, deleteTask, addNote, deleteNote, addLink, deleteLink, logProjectActivity,
    fetchConversations, fetchMessages, updateAiConfig, logActivity, updateStats
  }), [
    projects, leads, crmClients, crmProjects, websiteDraft, persistedWebsiteState, hasUnsavedChanges, saveStatus, saveWebsiteChanges, resetWebsiteChanges,
    appearance, siteContent, sections, config, setConfig,
    loading, mediaAssets, notifications, stats, activityLogs, conversations,
    setAppearance, updateText, updateSection, updateSectionArray, toggleVisibility, toggleNavbarVisibility,
    moveSection, reorderSections, setSectionsOrder, updateSectionLabel,
    addProject, updateProject, deleteProject, reorderProjects, addLead, updateLead, deleteLead,
    addCrmClient, updateCrmClient, deleteCrmClient, addCrmProject, updateCrmProject, deleteCrmProject, reorderCrmProjects,
    uploadMedia, deleteMedia, markNotificationAsRead, clearNotifications, fetchProjectData,
    addTask, updateTask, deleteTask, addNote, deleteNote, addLink, deleteLink, logProjectActivity,
    fetchConversations, fetchMessages, updateAiConfig, logActivity, updateStats
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
