# Ahmed Helal — Full System Build Prompt v1

This project already exists and is already under development.
Do NOT start from scratch.

You are working inside an existing React + Vite + TypeScript codebase for a premium cinematic portfolio website for Ahmed Helal.

Your job is to build the full MVP system layer around the existing public site, including:

- admin auth
- admin dashboard
- AI chat system
- saved conversations
- CRM / leads / tickets / users relations
- section/content management
- media management using Google Drive / external URLs
- editable AI knowledge base
- dashboard analytics / usage stats
- modern login and popup interfaces consistent with the website design language

You may divide the work into phases automatically, but you must preserve the current project and build on top of it.

---

## 1. Core Project Identity

This is NOT a generic landing page or generic CMS.
This is a premium cinematic interactive portfolio website for Ahmed Helal.

The public website visual identity must remain:

- dark
- premium
- cinematic
- futuristic
- minimal
- anti-gravity motion driven

The dashboard should remain visually connected to the brand, but more practical and productivity-oriented:

- modern
- clean
- minimal
- dark
- calm
- professional

---

## 2. Current Technical Context

The existing codebase already uses:

- React
- Vite
- TypeScript
- Tailwind CSS v4
- Framer Motion

The public website already has:

- Hero section
- Laptop interaction section
- Featured Work
- Services
- Client marquee
- Process
- Testimonials
- Metrics
- Contact CTA
- Footer
- floating AI button UI
- bilingual structure (EN / AR) in progress / available
- dark cinematic styling

Do NOT remove or replace the existing public site.
Extend it.

---

## 3. High-Level Goal

Build the full MVP system around the current website so Ahmed can:

- control site appearance and content
- control sections
- control projects and case studies
- control testimonials, metrics, client logos, social links
- manage AI settings and knowledge base
- see and manage AI conversations
- see and manage leads / project requests
- manage internal tickets
- track users / guest chat relations
- receive notifications
- work through a modern admin dashboard

---

## 4. Locked Product Decisions

These decisions are already finalized and must be respected.

### 4.1 Roles

Only these roles exist:

- super_admin
- admin

### 4.2 Access Model

- admin-only login
- no public signup flow
- admin accounts are created from the system / database
- guests can use the AI chat without login
- no optional user account flow for now

### 4.3 Dashboard UI

- sidebar + topbar layout
- modern clean minimal design
- search
- filters
- sorting
- bulk actions

### 4.4 Sections Model

Use fixed sections only.
Admins can:

- show / hide
- reorder
- edit content
  Do NOT build a dynamic block-builder CMS in the MVP.

### 4.5 Projects

- each project has an internal case study page
- project status options:
  - published
  - archived
- for MVP assume a single optional category per project

### 4.6 Media / Assets

Do NOT use Supabase Storage.
Use:

- Google Drive links
- external URLs

The dashboard media manager must support:

- drag and drop upload workflow
- image preview
- delete / replace
- crop / focal point settings
- alt text
- metadata editing
- external URL support

Important:
Google Drive is only the file source.
The dashboard must manage media records and metadata in the database.

### 4.7 AI / Chat

- guest users can open AI chat
- conversations are saved
- quick replies are required
- editable AI knowledge base from dashboard
- AI usage stats are required
- conversations must be linkable to leads

### 4.8 Relations

Each user-related record should support:

- conversations
- submissions / leads
- notes
- tags

Also:

- requests must be linked to conversations
- requests must be linkable to final projects after execution

### 4.9 Tickets

Ticket statuses:

- open
- pending
- in_progress
- done
- cancelled

Ticket priorities:

- low
- medium
- high
- urgent

### 4.10 Notifications

Use:

- email notifications
- dashboard notifications

---

## 5. Main Systems to Build

Build the MVP foundation for all of the following.

### 5.1 Admin Auth

Build an admin-only authentication system.

Requirements:

- login screen or login modal consistent with the public site aesthetic
- protected admin routes
- role guard for super_admin and admin
- no public signup page
- no user account creation for guests
- admin seed or database-created account model
- secure session handling
- secure logout
- basic forgot-password can be omitted in MVP unless already trivial

### 5.2 Login UI

The login experience should:

- match the visual identity of the site
- feel like a refined popup or dedicated dark auth view
- use glass / dark panel styling
- be minimal and clean
- not look like a generic admin template

### 5.3 AI Chat Popup

Build a real AI chat popup / panel that matches the website style.

Requirements:

- floating launcher button
- popup / floating panel, not a full page takeover
- dark premium styling consistent with site
- guest can open chat
- quick reply chips
- welcome message
- support saved conversations
- allow conversation status tracking
- connect to leads when needed
- preserve the public site's cinematic language

### 5.4 Admin Dashboard

Build a complete admin dashboard foundation.

Requirements:

- sidebar
- topbar
- dashboard overview
- searchable modules
- filters / sorting / bulk actions
- detail panels / drawers / forms
- modern clean minimal UI
- dark productivity-focused styling

---

## 6. Dashboard Sitemap

Build the dashboard around these modules.

### Dashboard

- Overview

### Website

- Site Settings
- Theme & Appearance
- Sections
- Hero
- Laptop Section
- Featured Work
- Services
- Client Logos
- Process
- Testimonials
- Metrics
- Contact CTA
- Footer
- Social Links

### Projects

- All Projects
- Add Project
- Edit Project
- Internal Case Study Blocks / Sections

### Media

- Media Library
- Link Manager
- Asset Metadata Editor

### AI

- AI Settings
- Knowledge Base
- Quick Replies
- Conversations
- AI Usage Stats

### CRM

- Leads
- Users
- Tickets
- Notes / Tags

### System

- Notifications
- Activity Logs
- Admins

---

## 7. Data Model / Database Schema

Implement the MVP around these entities and relations.

### 7.1 admins

Fields:

- id
- email
- password_hash
- role (super_admin | admin)
- full_name
- avatar_url
- is_active
- created_at
- updated_at
- last_login_at

### 7.2 site_settings

Fields:

- id
- site_name
- site_title
- site_subtitle
- logo_media_id
- favicon_media_id
- default_language
- primary_color
- secondary_color
- accent_color
- glow_color
- background_color
- text_primary
- text_secondary
- button_radius
- card_radius
- heading_font
- body_font
- theme_mode
- created_at
- updated_at
- updated_by_admin_id

### 7.3 media_assets

Fields:

- id
- title
- type (image | video | pdf | logo | icon)
- source_type (drive | external)
- original_url
- preview_url
- thumbnail_url
- alt_text
- focal_x
- focal_y
- width
- height
- mime_type
- notes
- is_active
- created_at
- updated_at
- uploaded_by_admin_id

### 7.4 sections

Fields:

- id
- key
- title_en
- title_ar
- subtitle_en
- subtitle_ar
- is_visible
- sort_order
- settings_json
- created_at
- updated_at
- updated_by_admin_id

### 7.5 social_links

Fields:

- id
- platform
- label
- url
- icon_key
- is_visible
- sort_order
- created_at
- updated_at

### 7.6 projects

Fields:

- id
- slug
- title_en
- title_ar
- summary_en
- summary_ar
- category
- cover_media_id
- status (published | archived)
- is_featured
- client_name
- year
- sort_order
- created_at
- updated_at
- updated_by_admin_id

### 7.7 project_blocks

For internal case study content:

- id
- project_id
- block_type (text | image | gallery | video | quote | metrics)
- title_en
- title_ar
- body_en
- body_ar
- media_id
- settings_json
- sort_order
- created_at
- updated_at

### 7.8 client_logos

Fields:

- id
- name
- logo_media_id
- website_url
- is_visible
- sort_order
- created_at
- updated_at

### 7.9 testimonials

Fields:

- id
- name
- role
- company
- avatar_media_id
- quote_en
- quote_ar
- status (approved | hidden)
- sort_order
- created_at
- updated_at

### 7.10 metrics

Fields:

- id
- label_en
- label_ar
- value
- suffix
- is_visible
- sort_order
- created_at
- updated_at

### 7.11 ai_settings

Fields:

- id
- assistant_name
- welcome_en
- welcome_ar
- system_prompt
- knowledge_base_text
- quick_replies_json
- cta_rules_json
- is_enabled
- created_at
- updated_at
- updated_by_admin_id

### 7.12 ai_usage_stats_daily

Fields:

- id
- date
- conversations_count
- messages_count
- guest_conversations_count
- lead_conversions_count
- top_quick_replies_json

### 7.13 users

Since there is no full public account system yet, users can represent identified contacts / visitors / leads:

- id
- full_name
- email
- whatsapp
- source
- status
- tags_json
- created_at
- updated_at

### 7.14 conversations

Fields:

- id
- user_id_nullable
- guest_session_id_nullable
- title
- lead_stage
- status (active | archived | deleted)
- started_at
- updated_at

### 7.15 messages

Fields:

- id
- conversation_id
- role (user | assistant | system)
- content
- metadata_json
- created_at

### 7.16 leads

Fields:

- id
- source (form | ai_chat | whatsapp)
- full_name
- email
- whatsapp
- company_name
- service_type
- budget
- timeline
- message
- status (new | contacted | qualified | in_progress | completed | cancelled | archived)
- assigned_admin_id
- user_id_nullable
- linked_conversation_id_nullable
- linked_project_id_nullable
- notes_count
- created_at
- updated_at

### 7.17 lead_notes

Fields:

- id
- lead_id
- admin_id
- note
- created_at
- updated_at

### 7.18 tickets

Fields:

- id
- title
- description
- status (open | pending | in_progress | done | cancelled)
- priority (low | medium | high | urgent)
- linked_user_id_nullable
- linked_lead_id_nullable
- linked_project_id_nullable
- assigned_admin_id_nullable
- due_date_nullable
- created_at
- updated_at

### 7.19 dashboard_notifications

Fields:

- id
- type
- title
- body
- is_read
- target_url
- created_at
- admin_id_nullable

### 7.20 activity_logs

Fields:

- id
- admin_id
- entity_type
- entity_id
- action (create | update | delete | publish | archive)
- summary
- created_at

---

## 8. Role Permissions

### super_admin

Can:

- manage admins
- manage all site settings
- manage all content
- manage AI settings and prompts
- manage all leads, conversations, users, tickets, logs
- delete / archive / publish anything
- control system-level settings

### admin

Can:

- manage site content
- manage sections
- manage projects
- manage client logos
- manage testimonials
- manage metrics
- manage conversations
- manage leads
- manage tickets
- manage media records
- manage AI quick replies and knowledge base if allowed
  Cannot:
- create or manage super_admins
- change highest-level system permissions

Implement practical route / permission guards in the UI and backend logic.

---

## 9. Public Website Content Control

The admin must be able to control the public site without editing code.

### 9.1 Appearance Controls

Allow editing:

- logo
- favicon
- primary colors
- accent colors
- glow colors
- text colors
- button style variables
- card style variables
- fonts
- global theme tokens

### 9.2 Section Controls

For each fixed section:

- show / hide
- reorder
- edit title/subtitle/content
- edit CTAs
- edit media links
- update images / videos / links
- preserve EN/AR content fields

### 9.3 Social Controls

Allow editing:

- platform
- icon selection / icon mapping
- visible / hidden
- order
- URL

### 9.4 Project Controls

Allow:

- create/edit/archive project
- internal case study editing
- reorder featured projects
- link project to client / lead optionally

### 9.5 Logo Controls

Allow:

- create/edit/delete client logos
- reorder
- visible / hidden
- website link

### 9.6 Testimonial Controls

Allow:

- create/edit/hide testimonials
- manage avatar and text
- reorder

### 9.7 Metric Controls

Allow:

- add/edit/remove metrics
- reorder
- show / hide

---

## 10. Media Management Using Google Drive / External URLs

Do NOT implement direct storage buckets in MVP.

Build a media manager that works like this:

- admin can create a media record
- admin can drag and drop files into the UI as a workflow aid
- admin can paste or store a Google Drive URL
- admin can also use an external URL
- admin can preview the asset
- admin can replace the link
- admin can delete / deactivate the media record
- admin can set alt text
- admin can set focal point values
- admin can reuse the same media across modules

Important:

- crop / focal point settings are stored as metadata, not real edits to the Drive file
- build helper utilities for generating preview / thumbnail style URLs when possible
- preserve future upgrade path to real storage later

---

## 11. AI Chat System Requirements

Build a functional AI chat layer, not just a button UI.

### 11.1 Public Chat UX

- guest can open chat without login
- popup / floating panel
- same design language as website
- modern clean dark UI
- quick replies
- welcome message
- scrollable message area
- CTA support
- premium motion but not distracting

### 11.2 Conversation Persistence

- save guest conversations
- support guest_session_id
- support later linking to a user or lead if identified
- track conversation status
- support archive / delete states in dashboard

### 11.3 AI Control from Dashboard

Allow admins to edit:

- assistant name
- welcome text EN/AR
- quick replies
- knowledge base text
- system prompt blocks
- CTA rules
- enabled / disabled state

### 11.4 AI Usage Stats

Track:

- total conversations
- total messages
- guest conversations count
- lead conversions from chat
- top quick replies used

### 11.5 Lead Creation from Chat

Allow a conversation to be linked to a lead / request when:

- user provides contact info
- user requests a project
- admin manually links it later
- AI flow marks it as relevant

---

## 12. CRM / Leads / Users / Tickets

Build a lightweight CRM layer inside the dashboard.

### 12.1 Leads

- create from form
- create from AI chat
- create from WhatsApp source
- searchable
- filterable
- sortable
- bulk actions
- assignable to admins
- note-taking support
- linkable to conversations
- linkable to projects

Lead status options:

- new
- contacted
- qualified
- in_progress
- completed
- cancelled
- archived

### 12.2 Users

Even without full public auth, build user/contact records that can store:

- contact info
- tags
- notes
- linked conversations
- linked leads
- linked tickets

### 12.3 Tickets

Build internal tickets with:

- statuses
- priorities
- linked user / lead / project
- assigned admin
- notes
- list views with filters and bulk actions

### 12.4 Data Relations

Preserve these relations:

- user → conversations
- user → leads
- user → notes / tags
- conversation → lead
- lead → final project
- ticket → user / lead / project

---

## 13. Notifications

Implement:

- dashboard notifications
- email notifications

At minimum notify admins about:

- new lead
- new project request
- important chat conversion
- ticket assignment or update

Use a clean notification pattern in the dashboard topbar.

---

## 14. Search / Filters / Sorting / Bulk Actions

These are required across relevant dashboard modules.

Apply them where appropriate to:

- projects
- client logos
- testimonials
- social links
- conversations
- leads
- users
- tickets
- media records

Bulk actions examples:

- delete
- archive
- publish
- hide
- mark as read
- update status
- assign admin

---

## 15. Bilingual Requirements

Preserve and support:

- English
- Arabic
- RTL / LTR
- translatable content fields where needed

At minimum:

- section titles/subtitles
- project titles/summaries
- testimonial quotes
- AI welcome messages
- quick replies
- key dashboard-managed public content

---

## 16. UI Requirements for Dashboard and Popups

### 16.1 Dashboard UI

Must be:

- modern
- clean
- minimal
- dark
- consistent with public brand
- more practical than the public site
- not overloaded with effects

### 16.2 Login UI

Must be:

- dark
- premium
- popup-like or focused auth page
- same design language as website

### 16.3 AI Chat Popup

Must be:

- floating
- dark glass / premium panel
- smooth and alive
- consistent with site

---

## 17. Technical Architecture Guidance

Use the existing project.
Do not rebuild from zero.

Build this in sensible phases automatically.
A recommended implementation order is:

### Phase 1

- admin auth
- route guards
- admin layout shell
- sidebar + topbar
- dashboard overview

### Phase 2

- site settings
- appearance controls
- section visibility/order
- social links
- media manager

### Phase 3

- projects + case study pages
- client logos
- testimonials
- metrics

### Phase 4

- AI settings
- AI chat persistence
- conversations UI
- usage stats

### Phase 5

- leads
- users
- tickets
- relations + filters + bulk actions
- notifications

You may refine the phase breakdown if needed, but keep the same priorities.

---

## 18. Hard Rules

- Do NOT start from scratch
- Do NOT break the existing public site
- Do NOT replace the current aesthetic with a generic admin template
- Do NOT remove the cinematic identity from the public site
- Do NOT build public signup
- Do NOT use Supabase Storage in MVP
- Do NOT simplify the system into a toy CRUD app

---

## 19. Expected Output / Working Style

Proceed with implementation in phases automatically.
Only ask questions if something is truly blocking.
Otherwise make safe MVP assumptions and keep going.

After each major milestone, summarize:

- what was built
- what files / modules were created
- what data structures were added
- what still remains

When possible:

- preserve scalability
- preserve maintainability
- keep code organized
- build reusable admin components
- keep route and module structure clean
