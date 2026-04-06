import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [appearance, setAppearanceDraft] = useState<Appearance>({
    accentColor: '#8b5cf6',
    bgColor: '#000000',
    coreGlow: 'rgba(139, 92, 246, 0.5)',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    glassmorphism: true
  });
  const [siteContent, setSiteContentDraft] = useState<Content>(initialContent);
  const [sections, setSectionsDraft] = useState<SectionBlueprint[]>(defaultBlueprint);
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

  const [persistedAppearance, setPersistedAppearance] = useState<Appearance | null>(null);
  const [persistedContent, setPersistedContent] = useState<Content | null>(null);
  const [persistedSections, setPersistedSections] = useState<SectionBlueprint[] | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
        const s = data.content;
        if (s.appearance) setPersistedAppearance(s.appearance);
        if (s.siteContent) setPersistedContent(s.siteContent as Content);
        if (s.sections) setPersistedSections(s.sections as SectionBlueprint[]);

        if (!isDirty) {
          if (s.appearance) setAppearanceDraft(prev => ({ ...prev, ...s.appearance }));
          if (s.config) setConfig(prev => ({ ...prev, ...s.config }));
          if (s.siteContent) {
            setSiteContentDraft(prev => {
              const merged = { ...prev };
              Object.entries(s.siteContent as Content).forEach(([key, value]) => {
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
          if (s.sections) setSectionsDraft(s.sections as SectionBlueprint[]);
        }
      }
    } catch (err) {
      console.error('[AdminContext] Settings Fetch Failed:', err);
    }
  }, [isDirty]);

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
        fetchSiteSettingsData()
      ]);

      if (p.data) setProjects(p.data as Project[]);
      if (l.data) setLeads(l.data as Lead[]);
      if (cClients.data) setCrmClients(cClients.data as CRMClient[]);
      if (cProjs.data) setCrmProjects(cProjs.data as CRMProject[]);
      if (m.data) setMediaAssets(m.data as MediaAsset[]);
      if (logs.data) setActivityLogs(logs.data as ActivityLog[]);
    } finally {
      setLoading(false);
    }
  }, [fetchSiteSettingsData]);

  useEffect(() => {
    fetchGlobalData();
    const channel = supabase.channel('site-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: 'id=eq.global' }, () => {
        fetchSiteSettingsData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchGlobalData, fetchSiteSettingsData]);

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
    setAppearanceDraft(prev => {
      const updated = { ...prev, ...updates };
      setIsDirty(true);
      return updated;
    });
  }, []);

  const updateText = useCallback((section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => {
    setSiteContentDraft(prev => {
      const newContent = { ...prev };
      const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
      const keys = fieldPath.split('.');
      let current: Record<string, unknown> = sectionData;
      for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]] as Record<string, unknown>; }
      if (lang === 'raw') current[keys[keys.length - 1]] = newValue;
      else (current[keys[keys.length - 1]] as Record<string, string>)[lang] = newValue;
      (newContent[section] as unknown) = sectionData;
      setIsDirty(true);
      return newContent;
    });
  }, []);

  const updateSectionArray = useCallback((section: keyof Content, fieldPath: string, newArray: unknown[]) => {
    setSiteContentDraft(prev => {
      const newContent = { ...prev };
      const sectionData = JSON.parse(JSON.stringify(newContent[section])) as Record<string, unknown>;
      const keys = fieldPath.split('.');
      let current: Record<string, unknown> = sectionData;
      for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]] as Record<string, unknown>; }
      current[keys[keys.length - 1]] = newArray;
      (newContent[section] as unknown) = sectionData;
      setIsDirty(true);
      return newContent;
    });
  }, []);

  const toggleVisibility = useCallback((id: SectionId) => {
    setSectionsDraft(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
      setIsDirty(true);
      return updated;
    });
  }, []);

  const toggleNavbarVisibility = useCallback((id: SectionId) => {
    setSectionsDraft(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, inNavbar: !s.inNavbar } : s);
      setIsDirty(true);
      return updated;
    });
  }, []);

  const moveSection = useCallback((id: SectionId, direction: 'up' | 'down') => {
    setSectionsDraft(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      const final = updated.map((s, i) => ({ ...s, order: i }));
      setIsDirty(true);
      return final;
    });
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setSectionsDraft(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const ordered = result.map((s, i) => ({ ...s, order: i }));
      setIsDirty(true);
      return ordered;
    });
  }, []);

  const setSectionsOrder = useCallback((newSections: SectionBlueprint[]) => {
    setSectionsDraft(newSections.map((s, i) => ({ ...s, order: i })));
    setIsDirty(true);
  }, []);

  const updateSectionLabel = useCallback((id: SectionId, labels: { en: string; ar: string }) => {
    setSectionsDraft(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, navLabel: labels } : s);
      setIsDirty(true);
      return updated;
    });
  }, []);

  // --- 6. Save/Cancel Draft Flow ---

  const saveChanges = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const payload = { appearance, config, siteContent, sections };
      const { error } = await supabase.from('site_settings').upsert({
        id: 'global', content: payload, updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;

      setPersistedAppearance(appearance);
      setPersistedContent(siteContent);
      setPersistedSections(sections);
      setIsDirty(false);
      setSaveStatus('saved');
      pushNotification("Changes published & live!", "system", "Site Published");
      setTimeout(() => setSaveStatus('idle'), 3000);
      logActivity('publish', 'site_settings', 'global');
    } catch (err) {
      setSaveStatus('error');
      pushNotification("Failed to publish changes.", "system", "Error");
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  }, [appearance, config, siteContent, sections, pushNotification, logActivity]);

  const cancelChanges = useCallback(() => {
    if (persistedAppearance) setAppearanceDraft(persistedAppearance);
    if (persistedContent) setSiteContentDraft(persistedContent);
    if (persistedSections) setSectionsDraft(persistedSections);
    setIsDirty(false);
    setSaveStatus('idle');
    pushNotification("Unsaved changes discarded.", "system");
  }, [persistedAppearance, persistedContent, persistedSections, pushNotification]);

  // --- 7. Instant CRUD (CRM, Media, Logs etc.) ---

  const addProject = useCallback(async (project: Omit<Project, 'id'>) => {
    const { data } = await supabase.from('projects').insert([project]).select();
    if (data) setProjects(prev => [data[0] as Project, ...prev]);
  }, []);
  const updateProject = useCallback(async (id: number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('projects').update(updates).eq('id', id);
  }, []);
  const deleteProject = useCallback(async (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  }, []);
  const reorderProjects = useCallback(async (id: number, newIndex: number) => {
    setProjects(prev => {
      const result = [...prev];
      const oldIndex = result.findIndex(p => p.id === id);
      if (oldIndex === -1) return prev;
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      const updated = result.map((p, i) => ({ ...p, displayorder: i }));
      Promise.all(updated.map(p => supabase.from('projects').update({ displayorder: p.displayorder }).eq('id', p.id)));
      return updated;
    });
  }, []);

  const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
    const { data } = await supabase.from('leads').insert([lead]).select();
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

  const uploadMedia = useCallback(async (file: File, meta: { category?: string; alt_text?: string; title?: string }) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('portfolio_assets').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('portfolio_assets').getPublicUrl(uploadData.path);
    const { data: asset, error: dbError } = await supabase.from('media_assets').insert([{
      name: file.name, url: publicUrl, type: file.type.split('/')[0], category: meta?.category || 'general'
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

  const updateAiConfig = useCallback(async (u: Partial<AdminConfig['ai']>) => {
    const updatedAi = { ...config.ai, ...u, lastUpdatedAt: new Date().toISOString() };
    const newConfig = { ...config, ai: updatedAi };
    setConfig(newConfig);
    const payload = { appearance, config: newConfig, siteContent, sections };
    await supabase.from('site_settings').upsert({ id: 'global', content: payload });
  }, [appearance, config, siteContent, sections]);

  // --- 8. Context Provisioning ---

  const value = useMemo(() => ({
    projects, leads, crmClients, crmProjects, appearance, siteContent, sections, config,
    loading, mediaAssets, notifications, stats, activityLogs, conversations, isDirty, saveStatus,
    setAppearance, updateText, updateSectionArray, toggleVisibility, toggleNavbarVisibility,
    moveSection, reorderSections, setSectionsOrder, updateSectionLabel, saveChanges, cancelChanges,
    addProject, updateProject, deleteProject, reorderProjects, addLead, updateLead, deleteLead,
    addCrmClient, updateCrmClient, deleteCrmClient, addCrmProject, updateCrmProject, deleteCrmProject,
    uploadMedia, deleteMedia, markNotificationAsRead, clearNotifications, fetchProjectData,
    addTask, updateTask, deleteTask, addNote, deleteNote, addLink, deleteLink, logProjectActivity,
    fetchConversations: async () => {}, fetchMessages: async () => [], updateAiConfig, logActivity, updateStats: () => {}
  }), [
    projects, leads, crmClients, crmProjects, appearance, siteContent, sections, config,
    loading, mediaAssets, notifications, stats, activityLogs, conversations, isDirty, saveStatus,
    setAppearance, updateText, updateSectionArray, toggleVisibility, toggleNavbarVisibility,
    moveSection, reorderSections, setSectionsOrder, updateSectionLabel, saveChanges, cancelChanges,
    addProject, updateProject, deleteProject, reorderProjects, addLead, updateLead, deleteLead,
    addCrmClient, updateCrmClient, deleteCrmClient, addCrmProject, updateCrmProject, deleteCrmProject,
    uploadMedia, deleteMedia, markNotificationAsRead, clearNotifications, fetchProjectData,
    addTask, updateTask, deleteTask, addNote, deleteNote, addLink, deleteLink, logProjectActivity,
    updateAiConfig, logActivity
  ]);

  return <AdminContext.Provider value={value as any}>{children}</AdminContext.Provider>;
};
