import React, { useState, useEffect, useCallback } from 'react';
import { content as initialContent, type Content } from '../data/content';
import { supabase } from '../lib/supabase';
import type { 
  Project, Lead, Appearance, SectionId, SectionBlueprint,
  Notification, MediaAsset, AdminConfig, SystemStats
} from '../types/admin';

import { defaultBlueprint } from '../types/admin';
import { AdminContext } from './useAdmin';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // --- 1. Master States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
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
      welcomeMessage: 'SYSTEM ONLINE. Welcome back, Ahmed. I am AURA. How may I assist you today?',
      tone: 'Professional/Tech',
      systemPrompt: '',
      autoSuggest: true,
      leadCaptureEnforcement: true
    }
  });
  const [siteContent, setSiteContent] = useState<Content>(initialContent);
  const [sections, setSections] = useState<SectionBlueprint[]>(defaultBlueprint);
  const [loading, setLoading] = useState(true);

  // --- 2. Initial Data Fetch ---
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);

        const [
          { data: dbProjects },
          { data: dbLeads },
          { data: dbSettings }
        ] = await Promise.all([
          supabase.from('projects').select('*').order('displayOrder', { ascending: true }),
          supabase.from('leads').select('*').order('date', { ascending: false }),
          supabase.from('site_settings').select('content').eq('id', 'global').single()
        ]);

        if (dbProjects) setProjects(dbProjects as Project[]);
        if (dbLeads) setLeads(dbLeads as Lead[]);

        if (dbSettings?.content) {
          const s = dbSettings.content;
          if (s.appearance) setAppearance(s.appearance);
          if (s.config) setConfig(s.config);
          if (s.siteContent) setSiteContent(s.siteContent);
          if (s.sections) setSections(s.sections);
        }

      } catch (err) {
        console.error("Supabase Initialization Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  // --- 3. Persistence Helpers ---
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
      await supabase.from('site_settings').upsert({
        id: 'global',
        content: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (err) {
      console.error("Failed to sync settings to cloud:", err);
    }
  }, [appearance, config, siteContent, sections]);

  // --- 4. CRUD Operations ---
  
  // Projects
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase.from('projects').insert([project]).select();
      if (error) throw error;
      if (data) setProjects(prev => [data[0] as Project, ...prev]);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Leads
  const addLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const { data, error } = await supabase.from('leads').insert([lead]).select();
      if (error) throw error;
      if (data) setLeads(prev => [data[0] as Lead, ...prev]);
    } catch (err) {
      console.error("Error adding lead:", err);
    }
  };

  // --- 5. Content Managers ---
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

  const toggleVisibility = (id: SectionId) => {
    setSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
      syncSettings({ sections: updated });
      return updated;
    });
  };

  const moveSection = (id: SectionId, direction: 'up' | 'down') => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;

      const newSections = [...prev];
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      
      const ordered = newSections.map((s, i) => ({ ...s, order: i }));
      syncSettings({ sections: ordered });
      return ordered;
    });
  };

  const updateStats = (newStats: Partial<SystemStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <AdminContext.Provider value={{
      projects, setProjects,
      leads, setLeads,
      addProject, updateProject, deleteProject,
      addLead,
      appearance, setAppearance,
      config, setConfig,
      siteContent, updateText, updateSectionArray,
      sections, notifications, setNotifications,
      mediaAssets, setMediaAssets,
      markNotificationAsRead, clearNotifications,
      toggleVisibility, moveSection,
      stats, updateStats
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
