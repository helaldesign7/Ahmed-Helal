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
  status: 'pending' | 'in_progress' | 'completed' | 'not_completed';
  date: string;
  source: string;
  session_id?: string;
}

export interface CRMClient {
  id: number;
  name: string;
  brand_company: string;
  email: string;
  phone_whatsapp: string;
  source: string;
  notes: string;
  preferred_contact: 'email' | 'whatsapp' | 'both';
  last_interaction_date: string;
  status: 'active' | 'inactive' | 'lead';
  created_at: string;
  updated_at: string;
}

export interface CRMProject {
  id: number;
  client_id: number;
  project_name: string;
  description: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  notes: string;
  due_date: string;
  budget: string;
  paid_amount: string;
  remaining_amount: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  archived: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string;
  created_at: string;
}

export interface ProjectNote {
  id: string;
  project_id: number;
  content: string;
  created_at: string;
}

export interface ProjectLink {
  id: string;
  project_id: number;
  label: string;
  url: string;
  category?: string;
  created_at: string;
}

export interface ProjectActivity {
  id: string;
  project_id: number;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface Appearance {
  accentColor: string;
  bgColor: string;
  coreGlow: string;
  fontFamily: string;
  borderRadius: string;
  glassmorphism: boolean;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
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
  inNavbar: boolean;
  navLabel: { en: string; ar: string };
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
  id: string; // UUID from DB
  filename: string;
  storage_path: string;
  full_url: string;
  type: 'image' | 'video' | 'document';
  mime_type: string;
  size_bytes: number;
  source: 'upload' | 'external' | 'drive';
  category: string;
  tags?: string[];
  alt_text?: string;
  title?: string;
  created_at: string;
  updated_at?: string;
}

export interface SystemStats {
  visits: number;
  activeUsers: number;
  uptime: string;
  load: number;
}

export interface ActivityLog {
  id: number;
  admin_id?: string;
  action: string;
  target_type: string;
  target_id?: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  guest_session_id: string;
  last_message_at: string;
  status: 'active' | 'archived';
  metadata?: {
    hasLead?: boolean;
    [key: string]: unknown;
  };
  created_at: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AdminConfig {
  ai: {
    assistantName: string;
    welcomeMessageEn: string;
    welcomeMessageAr: string;
    tone: string;
    systemPrompt: string;
    knowledgeBase: string;
    autoSuggest: boolean;
    leadCaptureEnforcement: boolean;
    lastUpdatedAt: string;
  };
}

export interface WebsiteState {
  appearance: Appearance;
  config: AdminConfig;
  siteContent: Content;
  sections: SectionBlueprint[];
}

export interface AdminContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (id: number, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  
  crmClients: CRMClient[];
  setCrmClients: React.Dispatch<React.SetStateAction<CRMClient[]>>;
  addCrmClient: (client: Omit<CRMClient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCrmClient: (id: number, updates: Partial<CRMClient>) => Promise<void>;
  deleteCrmClient: (id: number) => Promise<void>;

  crmProjects: CRMProject[];
  setCrmProjects: React.Dispatch<React.SetStateAction<CRMProject[]>>;
  addCrmProject: (project: Omit<CRMProject, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCrmProject: (id: number, updates: Partial<CRMProject>) => Promise<void>;
  deleteCrmProject: (id: number) => Promise<void>;
  reorderCrmProjects: (projectId: number, newIndex: number) => Promise<void>;

  // --- 4. Public Site Configuration (Draftable) ---
  appearance: Appearance;
  setAppearance: (newAppearance: Partial<Appearance>) => void;
  config: AdminConfig;
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>;
  siteContent: Content;
  updateText: (section: keyof Content, fieldPath: string, lang: 'en' | 'ar' | 'raw', newValue: string) => void;
  updateSection: <S extends keyof Content>(section: S, newValue: Content[S]) => void;
  updateSectionArray: (section: keyof Content, fieldPath: string, newArray: unknown[]) => void;
  sections: SectionBlueprint[];
  toggleVisibility: (id: SectionId) => void;
  toggleNavbarVisibility: (id: SectionId) => void;
  moveSection: (id: SectionId, direction: 'up' | 'down') => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  setSectionsOrder: (newSections: SectionBlueprint[]) => void;
  updateSectionLabel: (id: SectionId, labels: { en: string; ar: string }) => void;
  
  // --- Draft System Control ---
  websiteDraft: WebsiteState;
  persistedWebsiteState: WebsiteState | null;
  hasUnsavedChanges: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveWebsiteChanges: () => Promise<void>;
  resetWebsiteChanges: () => void;

  // --- 5. System & Media State ---
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  loading: boolean;
  mediaAssets: MediaAsset[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  uploadMedia: (file: File, metadata?: { category?: string; alt_text?: string; title?: string }) => Promise<MediaAsset>;
  deleteMedia: (assetId: string) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // --- 5. CRM & Admin Operations (Instant Persistence) ---
  reorderProjects: (projectId: number, newIndex: number) => Promise<void>;
  
  stats: SystemStats;
  updateStats: (newStats: Partial<SystemStats>) => void;

  activityLogs: ActivityLog[];
  logActivity: (action: string, targetType: string, targetId?: string, details?: Record<string, unknown>) => Promise<void>;

  conversations: ChatConversation[];
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<ChatMessage[]>;
  updateAiConfig: (updates: Partial<AdminConfig['ai']>) => Promise<void>;

  // Project Workspace Sub-resources
  fetchProjectData: (projectId: number) => Promise<{
    tasks: ProjectTask[];
    notes: ProjectNote[];
    links: ProjectLink[];
    activities: ProjectActivity[];
  }>;
  addTask: (task: Omit<ProjectTask, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<ProjectTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (note: Omit<ProjectNote, 'id' | 'created_at'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addLink: (link: Omit<ProjectLink, 'id' | 'created_at'>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  logProjectActivity: (projectId: number, action: string, details?: Record<string, unknown>) => Promise<void>;
}

export const defaultBlueprint: SectionBlueprint[] = [
  { id: 'hero', name: 'Hero Scene', isVisible: true, type: 'core', order: 0, inNavbar: true, navLabel: { en: 'Home', ar: 'الرئيسية' } },
  { id: 'laptop', name: 'Interactive Laptop 3D', isVisible: true, type: 'core', order: 1, inNavbar: false, navLabel: { en: 'Experience', ar: 'التجربة' } },
  { id: 'projects', name: 'Featured Work & Projects', isVisible: true, type: 'content', order: 2, inNavbar: true, navLabel: { en: 'Portfolio', ar: 'معرض الأعمال' } },
  { id: 'services', name: 'Services Universe', isVisible: true, type: 'content', order: 3, inNavbar: true, navLabel: { en: 'Services', ar: 'خدماتي' } },
  { id: 'marquee', name: 'Client Logos Marquee', isVisible: true, type: 'widget', order: 4, inNavbar: false, navLabel: { en: 'Clients', ar: 'عملائي' } },
  { id: 'process', name: 'Our Process', isVisible: true, type: 'content', order: 5, inNavbar: true, navLabel: { en: 'Process', ar: 'المسار' } },
  { id: 'start-project', name: 'Start a Project Inquiry', isVisible: true, type: 'core', order: 6, inNavbar: false, navLabel: { en: 'Inquiry', ar: 'طلب عمل' } },
  { id: 'testimonials', name: 'Client Testimonials', isVisible: true, type: 'content', order: 7, inNavbar: false, navLabel: { en: 'Reviews', ar: 'آراء' } },
  { id: 'metrics', name: 'Global Statistics', isVisible: true, type: 'widget', order: 8, inNavbar: false, navLabel: { en: 'Stats', ar: 'إحصائيات' } },
  { id: 'contact', name: 'Contact Call to Action', isVisible: true, type: 'core', order: 9, inNavbar: true, navLabel: { en: 'Contact', ar: 'تواصل' } }
];
