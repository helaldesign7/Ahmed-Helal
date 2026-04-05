export interface Project {
  id: number;
  title: string;
  titleAr?: string;
  category: string;
  categoryAr?: string;
  status: 'published' | 'archived';
  isFeatured: boolean;
  date: string;
  content: string;
  featuredMediaUrl: string;
  imageUrl?: string; // public card image (can differ from featuredMediaUrl)
  displayOrder?: number;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  company?: string;
  interest: string; 
  serviceType: string;
  projectTitle?: string;
  description: string;
  budget: string;
  timeline?: string;
  preferredContact: 'email' | 'whatsapp' | 'both';
  qualifiers?: {
    hasIdentity: string;
    workType: string;
  };
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'lost';
  date: string;
  source: string;
}

export interface Appearance {
  accentColor: string;
  bgColor: string;
  coreGlow: string;
  fontFamily: string;
  borderRadius: string;
  glassmorphism: boolean;
}

export interface ServiceItem {
  title: { en: string; ar: string };
  tags: { en: string; ar: string };
  description: { en: string; ar: string };
  orbit: number;
}

export interface ProcessStep {
  number: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export interface TestimonialItem {
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  company: { en: string; ar: string };
  quote: { en: string; ar: string };
  avatar: string;
}

export interface MetricItem {
  value: string;
  label: { en: string; ar: string };
}

export interface MarqueeLogo {
  name: string;
  image: string;
}

export type SectionId = 'hero' | 'laptop' | 'projects' | 'services' | 'marquee' | 'process' | 'testimonials' | 'metrics' | 'contact' | 'start-project';

export interface SectionBlueprint {
  id: SectionId;
  name: string;
  isVisible: boolean;
  type: 'core' | 'content' | 'widget';
  order: number;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '139, 92, 246';
}

import { type Content } from '../data/content';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'lead' | 'system' | 'update';
  link: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document';
  source: 'drive' | 'external' | 'upload';
  size: string;
  date: string;
  url: string;
  category?: string;
  tags?: string[];
}

export interface SystemStats {
  visits: number;
  activeUsers: number;
  uptime: string;
  load: number;
}

export interface AdminConfig {
  ai: {
    assistantName: string;
    welcomeMessage: string;
    tone: string;
    systemPrompt: string;
    autoSuggest: boolean;
    leadCaptureEnforcement: boolean;
  };
}

export interface AdminContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  appearance: Appearance;
  setAppearance: React.Dispatch<React.SetStateAction<Appearance>>;
  config: AdminConfig;
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>;
  siteContent: Content;
  updateText: (section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => void;
  updateSectionArray: (section: keyof Content, fieldPath: string, newArray: unknown[]) => void;

  sections: SectionBlueprint[];
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  mediaAssets: MediaAsset[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  toggleVisibility: (id: SectionId) => void;
  moveSection: (id: SectionId, direction: 'up' | 'down') => void;
  
  stats: SystemStats;
  updateStats: (newStats: Partial<SystemStats>) => void;
}

export const defaultBlueprint: SectionBlueprint[] = [
  { id: 'hero', name: 'Hero Scene', isVisible: true, type: 'core', order: 0 },
  { id: 'laptop', name: 'Interactive Laptop 3D', isVisible: true, type: 'core', order: 1 },
  { id: 'projects', name: 'Featured Work & Projects', isVisible: true, type: 'content', order: 2 },
  { id: 'services', name: 'Services Universe', isVisible: true, type: 'content', order: 3 },
  { id: 'marquee', name: 'Client Logos Marquee', isVisible: true, type: 'widget', order: 4 },
  { id: 'process', name: 'Our Process', isVisible: true, type: 'content', order: 5 },
  { id: 'start-project', name: 'Start a Project Inquiry', isVisible: true, type: 'core', order: 6 },
  { id: 'testimonials', name: 'Client Testimonials', isVisible: true, type: 'content', order: 7 },
  { id: 'metrics', name: 'Global Statistics', isVisible: true, type: 'widget', order: 8 },
  { id: 'contact', name: 'Contact Call to Action', isVisible: true, type: 'core', order: 9 }
];
