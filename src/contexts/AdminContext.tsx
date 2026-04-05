import React, { useState, useEffect } from 'react';
import { content as initialContent, type Content } from '../data/content';
import { hexToRgb } from '../types/admin';
import type { 
  Project, Lead, Appearance, SectionId, SectionBlueprint,
  Notification, MediaAsset, AdminConfig, SystemStats

} from '../types/admin';

import { defaultBlueprint } from '../types/admin';
import { AdminContext } from './useAdmin';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // 1. Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) return JSON.parse(saved) as Project[];
    return [
      {
        id: 1, title: 'Al Ahly SC — Seasonal Identity', titleAr: 'الأهلي — الهوية الموسمية',
        category: 'Sports Design', categoryAr: 'تصميم رياضي', status: 'published', isFeatured: true,
        date: 'Apr 01, 2026', content: '# Al Ahly SC\n\nSeasonal visual identity system for the Egyptian football club.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 1
      },
      {
        id: 2, title: 'Nike Air Max — Cinematic Campaign', titleAr: 'نايك إير ماكس — حملة سينمائية',
        category: 'Advertising', categoryAr: 'إعلانات', status: 'published', isFeatured: true,
        date: 'Mar 20, 2026', content: '# Nike Air Max\n\nCinematic product campaign for Nike Air Max 2026.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1552346166-2a48eb020038?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1552346166-2a48eb020038?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 2
      },
      {
        id: 3, title: 'Ethereum — Brand Core', titleAr: 'إيثيريوم — الهوية الجوهرية',
        category: 'FinTech Branding', categoryAr: 'هوية مالية', status: 'published', isFeatured: false,
        date: 'Mar 10, 2026', content: '# Ethereum Brand Core\n\nComplete brand language refresh for Ethereum ecosystem.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004009?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004009?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 3
      },
      {
        id: 4, title: 'Rolex — 3D Visualization', titleAr: 'رولكس — التصور ثلاثي الأبعاد',
        category: 'Product Design', categoryAr: 'تصميم منتجات', status: 'published', isFeatured: false,
        date: 'Feb 28, 2026', content: '# Rolex 3D\n\nUltra-realistic 3D product visualization for Rolex Submariner.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 4
      },
      {
        id: 5, title: 'Formula 1 — Motion System', titleAr: 'فورمولا ١ — نظام الحركة',
        category: 'Motion Graphics', categoryAr: 'موشن جرافيك', status: 'published', isFeatured: false,
        date: 'Feb 12, 2026', content: '# Formula 1 Motion\n\nBroadcast motion graphics system for F1 2026 season.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1596727147705-61a532a655bd?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1596727147705-61a532a655bd?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 5
      },
      {
        id: 6, title: 'Cyberpunk 2077 — Key Art', titleAr: 'سايبربانك ٢٠٧٧ — الفن الرئيسي',
        category: 'Visual Art', categoryAr: 'فن بصري', status: 'published', isFeatured: false,
        date: 'Jan 30, 2026', content: '# Cyberpunk 2077\n\nKey art and promotional visual direction for the 2077 Phantom Liberty DLC.',
        featuredMediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
        displayOrder: 6
      },
    ];
  });

  // 2. Leads State
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('portfolio_leads');
    if (saved) return JSON.parse(saved) as Lead[];
    return [
      { 
        id: 1, 
        name: 'Sarah Jenkins', 
        email: 'sarah@studio.com', 
        interest: 'Full Branding', 
        serviceType: 'Brand Identity',
        description: 'Complete visual identity overhaul for a digital agency.', 
        budget: '$1000+', 
        preferredContact: 'email',
        status: 'new', 
        date: 'Today, 10:42 AM', 
        company: 'Digital Studio', 
        source: 'Contact Form' 
      },
      { 
        id: 2, 
        name: 'Mark Davis', 
        email: 'mark@techflow.io', 
        interest: 'Web App Design', 
        serviceType: 'Website Design',
        description: 'Looking to build a reactive dashboard for our SaaS.',
        budget: '$500-1000',
        preferredContact: 'both',
        status: 'in_progress', 
        date: 'Yesterday', 
        company: 'TechFlow', 
        source: 'AI Chat' 
      },
    ];
  });

  // 3. Appearance State
  const [appearance, setAppearance] = useState<Appearance>(() => {
    const saved = localStorage.getItem('portfolio_appearance');
    if (saved) return JSON.parse(saved) as Appearance;
    return {
      accentColor: '#8b5cf6',
      bgColor: '#050505',
      coreGlow: 'rgba(139, 92, 246, 0.2)',
      fontFamily: 'Inter',
      borderRadius: '12px',
      glassmorphism: true
    };
  });


  // 4. Site Content State
  const [siteContent, setSiteContent] = useState<Content>(() => {
    const saved = localStorage.getItem('portfolio_content');
    if (!saved) return initialContent;
    const parsed = JSON.parse(saved) as Content;
    // Migration: ensure startProject exists
    if (!parsed.startProject) {
      return { ...parsed, startProject: initialContent.startProject };
    }
    return parsed;
  });

  const [sections, setSections] = useState<SectionBlueprint[]>(() => {
    const saved = localStorage.getItem('portfolio_sections');
    if (!saved) return defaultBlueprint;
    const parsed = JSON.parse(saved) as SectionBlueprint[];
    if (!parsed.find(s => s.id === 'start-project')) {
      const startProjectSection = defaultBlueprint.find(s => s.id === 'start-project');
      if (startProjectSection) {
        const testimonialsIdx = parsed.findIndex(s => s.id === 'testimonials');
        const newSections = [...parsed];
        if (testimonialsIdx !== -1) {
          newSections.splice(testimonialsIdx, 0, startProjectSection);
        } else {
          newSections.push(startProjectSection);
        }
        return newSections;
      }
    }
    return parsed;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('portfolio_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'New Project Request', description: 'Sarah Jenkins requested a quote for Full Branding.', time: 'Just now', read: false, type: 'lead', link: '/admin/crm' },
      { id: '2', title: 'System Update', description: 'Model gemini-3.5-flash successfully connected.', time: '1 hr ago', read: false, type: 'system', link: '/admin/ai' },
    ];
  });

  // Note: migration for 'start-project' section and 'startProject' content
  // is handled directly inside the useState initializers above (lines ~122-152).
  // No useEffect needed here.

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('portfolio_assets');
    if (saved) return JSON.parse(saved) as MediaAsset[];
    return [
      { id: 'MD-01', title: 'hero-bg-2026.mp4', type: 'video', source: 'drive', size: '24 MB', date: 'Oct 10', url: '#' },
      { id: 'MD-02', title: 'client-logo-acme.png', type: 'image', source: 'external', size: '120 KB', date: 'Yesterday', url: '#' },
      { id: 'MD-03', title: 'case-study-hero.jpg', type: 'image', source: 'drive', size: '1.2 MB', date: 'Today', url: '#' },
    ];
  });

  // 8. System Config State (SAFE SETTINGS ONLY)
  const [config, setConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('portfolio_config');
    const defaultConfig = {
      ai: {
        assistantName: 'AURA',
        welcomeMessage: "SYSTEM ONLINE. I am the digital assistant assigned to Ahmed's portfolio. How may I route your inquiry today?",
        tone: 'Cinematic / Robotic (Jarvis style)',
        systemPrompt: `You are an AI assistant representing Ahmed Helal...`,
        autoSuggest: true,
        leadCaptureEnforcement: false
      }
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      delete parsed.system; // Security: Ensure legacy secrets are wiped
      return { ...defaultConfig, ...parsed };
    }
    return defaultConfig;
  });
  // 9. System Stats State
  const [stats, setStats] = useState<SystemStats>(() => {
    const saved = localStorage.getItem('portfolio_stats');
    if (saved) return JSON.parse(saved) as SystemStats;
    return {
      visits: 1240,
      activeUsers: 3,
      uptime: '99.9%',
      load: 12
    };
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('portfolio_projects', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('portfolio_leads', JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem('portfolio_appearance', JSON.stringify(appearance)), [appearance]);
  useEffect(() => localStorage.setItem('portfolio_content', JSON.stringify(siteContent)), [siteContent]);
  useEffect(() => localStorage.setItem('portfolio_sections', JSON.stringify(sections)), [sections]);
  useEffect(() => localStorage.setItem('portfolio_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('portfolio_assets', JSON.stringify(mediaAssets)), [mediaAssets]);
  useEffect(() => localStorage.setItem('portfolio_config', JSON.stringify(config)), [config]);
  useEffect(() => localStorage.setItem('portfolio_stats', JSON.stringify(stats)), [stats]);




  // CSS Variable Bridge
  useEffect(() => {
    const root = document.documentElement;
    
    // Tailwind v4 mapping (maps to --color-accent-violet and --color-primary-black)
    const rgb = hexToRgb(appearance.accentColor);
    root.style.setProperty('--color-accent-violet', appearance.accentColor);
    root.style.setProperty('--accent-violet-rgb', rgb);
    root.style.setProperty('--color-primary-black', appearance.bgColor);
    
    root.style.setProperty('--accent-glow', `rgba(${rgb}, 0.2)`);
    root.style.setProperty('--font-main', appearance.fontFamily);
    root.style.setProperty('--radius-main', appearance.borderRadius);
    root.style.setProperty('--glass-opacity', appearance.glassmorphism ? '0.1' : '0.02');
    
    // Global Body background override
    document.body.style.backgroundColor = appearance.bgColor;
  }, [appearance]);



  const updateText = (section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => {
    setSiteContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev)) as Content;
      const keys = fieldPath.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: Record<string, any> = newContent[section];
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      const lastKey = keys[keys.length - 1];

      if (lang === 'raw') {
        current[lastKey] = newValue;
      } else {
        current[lastKey] = { ...current[lastKey], [lang]: newValue };
      }
      return newContent;
    });
  };

  const toggleVisibility = (id: SectionId) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const moveSection = (id: SectionId, direction: 'up' | 'down') => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const newSections = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
      return newSections;
    });
  };

  const updateSectionArray = (section: keyof Content, fieldPath: string, newArray: unknown[]) => {
    setSiteContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      if (fieldPath === '') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newContent as any)[section] = newArray;
      } else {
        const keys = fieldPath.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = (newContent as any)[section];
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = newArray;
      }
      return newContent as Content;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateStats = (newStats: Partial<SystemStats>) => {
    setStats((prev: SystemStats) => ({ ...prev, ...newStats }));
  };



  return (
    <AdminContext.Provider value={{
      projects, setProjects,
      leads, setLeads,
      appearance, setAppearance,
      config, setConfig,
      siteContent, updateText, updateSectionArray,

      sections, toggleVisibility, moveSection,
      notifications, setNotifications,
      mediaAssets, setMediaAssets,
      markNotificationAsRead, clearNotifications,
      
      stats, updateStats
    }}>

      {children}
    </AdminContext.Provider>
  );
};

