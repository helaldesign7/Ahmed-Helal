You are working on a full-stack portfolio system with Admin Dashboard, AI Chat, and Supabase backend.

Your task is to implement ALL the following features in structured phases. Do NOT skip steps. Do NOT leave partial implementations.

========================================
🚨 EXECUTION STRATEGY (VERY IMPORTANT)
========================================

Work in structured phases.

For EACH phase:

1. Analyze related files
2. Implement changes fully
3. Fix all dependencies
4. Test behavior logically
5. Then move to next phase

After each phase, output:

- What was done
- Files modified
- Database changes (if any)
- What’s next

DO NOT jump between phases.

========================================
PHASE 1: AI CHAT UI + BEHAVIOR
========================================

1. Floating AI Button:

- Reduce its size (currently too large)
- Keep it ALWAYS on the RIGHT side (even in Arabic / RTL)
- Do NOT mirror position in RTL
- Make spacing responsive for all devices

2. Chat Panel UI:

- Improve overall design:
  - better spacing
  - better message bubbles
  - better readability
  - responsive layout (mobile-first)
- Maintain current design language (dark / cinematic)

3. Auth Sync:

- On login OR logout:
  - Force UI refresh or reset state
  - Clear chat state completely on logout
  - Prevent previous user chat from appearing

========================================
PHASE 2: MOBILE BACK BUTTON LOGIC
========================================

Implement custom navigation behavior:

- If user scrolls past Hero section:
  - First BACK press → scroll to top
  - Second BACK press → exit normally

Constraints:

- Only apply on mobile/tablet
- No infinite loop
- Do NOT break browser history

========================================
PHASE 3: LEADS (طلبات الموقع)
========================================

Create/improve Leads system:

Display:

- name
- email
- service type
- message
- date

Add status system:

- Pending
- In Progress
- Completed
- Not Completed

Requirements:

- Editable status
- Save to Supabase
- Immediate UI update after change

========================================
PHASE 4: INTERNAL CRM SYSTEM (IMPORTANT)
========================================

Create FULL internal system for:

1. Clients
2. Projects

This system must:

- Work inside dashboard ONLY
- NOT affect public site performance

---

## PHASE 4A: CLIENTS

Fields:

- name
- brand/company
- email
- phone / whatsapp
- source (website / manual / whatsapp / instagram / other)
- notes
- created_at
- updated_at

Features:

- Add client manually
- Edit client
- Search/filter
- Count projects per client

---

## PHASE 4B: PROJECTS

Fields:

- client_id
- project_name
- description
- requirements
- status
- notes
- created_at
- updated_at

Statuses:

- Pending
- In Progress
- Completed
- On Hold
- Cancelled

Features:

- Add project
- Link to client
- Edit
- Update status
- Filter/search

---

## PHASE 4C: CRM ADVANCED FIELDS

Add support for:

Projects:

- due_date
- budget
- paid_amount
- remaining_amount
- priority
- tags
- archived

Clients:

- preferred contact method
- last interaction date
- client status

Keep UI simple but schema ready.

========================================
PHASE 5: SUPABASE GLOBAL STORAGE (CRITICAL)
========================================

IMPORTANT REQUIREMENT:

ALL clients, projects, and leads MUST be stored in Supabase.

NOT localStorage.

Requirements:

- Create proper tables:
  - clients
  - projects
  - leads (if not already correct)

- Add relationships:
  - projects.client_id → clients.id

- Ensure:
  - Data is globally accessible
  - Admin can retrieve everything anytime

- Implement proper RLS:
  - Public: NO access
  - Authenticated admin: full access

---

## ⚠️ ACCOUNT SECURITY REQUIREMENT

The system must:

- Store user/client login data securely using Supabase Auth
- NOT expose passwords in frontend or logs
- Allow owner (admin) to manage accounts via Supabase dashboard ONLY
- Do NOT build custom password storage system
- Use Supabase Auth correctly

========================================
PHASE 6: DRAG & DROP FIX (VERY IMPORTANT)
========================================

There is an existing drag-and-drop feature (likely for sections ordering) but it is NOT working.

Tasks:

- Find existing drag-and-drop implementation
- Fix it completely

Requirements:

- Smooth drag experience
- Correct reorder behavior
- Persist order in database
- Update UI instantly

If not stable:

- Rebuild using a reliable library (like dnd-kit)

BONUS:

- If possible, extend drag-and-drop to:
  - reorder sections
  - reorder projects inside dashboard

========================================
PHASE 7: PERFORMANCE OPTIMIZATION
========================================

- Admin data MUST NOT load on public pages
- CRM data MUST stay inside dashboard only
- Lazy load dashboard modules
- Keep homepage fast

========================================
PHASE 8: TESTING
========================================

Verify:

- Chat UI works on all devices
- Chat stays on RIGHT side always
- Login/logout resets UI
- Mobile back behavior works
- Leads appear and update
- Clients can be created
- Projects can be created and linked
- Drag & drop works correctly
- Data persists in Supabase
- Public site remains fast

========================================
FINAL OUTPUT REQUIRED
========================================

After completion, provide:

1. Files modified
2. New components created
3. Supabase schema (SQL)
4. RLS policies added
5. How CRM works
6. How drag-drop works
7. How auth + refresh works
8. Any manual steps needed

========================================
RULES
========================================

- Do NOT explain only — IMPLEMENT
- Do NOT break existing system
- Do NOT leave partial logic
- Do NOT use localStorage for core data
- Always connect UI → Backend → Database properly

Focus on building a REAL production-level system.
