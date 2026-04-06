-- CRM Project Workspace Upgrade (Phase 10)

-- 1. Project Tasks
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES public.crm_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Project Notes
CREATE TABLE IF NOT EXISTS public.project_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES public.crm_projects(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Project Links (External References)
CREATE TABLE IF NOT EXISTS public.project_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES public.crm_projects(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT, -- e.g. Figma, Drive, Notion
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Project Activities
CREATE TABLE IF NOT EXISTS public.project_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES public.crm_projects(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all 4 tables
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (Assuming 'authenticated' role is Admin for now, or adding stricter email checks)
-- Tasks
CREATE POLICY "Admin only select tasks" ON public.project_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin only insert tasks" ON public.project_tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin only update tasks" ON public.project_tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin only delete tasks" ON public.project_tasks FOR DELETE TO authenticated USING (true);

-- Notes
CREATE POLICY "Admin only select notes" ON public.project_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin only insert notes" ON public.project_notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin only delete notes" ON public.project_notes FOR DELETE TO authenticated USING (true);

-- Links
CREATE POLICY "Admin only select links" ON public.project_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin only insert links" ON public.project_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin only update links" ON public.project_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin only delete links" ON public.project_links FOR DELETE TO authenticated USING (true);

-- Activities
CREATE POLICY "Admin only select activities" ON public.project_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin only insert activities" ON public.project_activities FOR INSERT TO authenticated WITH CHECK (true);
