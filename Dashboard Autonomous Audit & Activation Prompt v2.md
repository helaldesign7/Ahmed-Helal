# Dashboard Autonomous Audit & Activation Prompt v2

You are working inside an already built project that contains:

- a public cinematic portfolio website
- an admin/dashboard system in progress

Do NOT start from scratch.

Your task is to autonomously inspect the existing codebase and convert the dashboard/admin area from a partially presentational interface into a truly functional MVP control system.

Important:
Do not rely only on screenshots or assumed structure.
You must inspect the actual codebase, routes, components, pages, state, data flow, and currently implemented admin logic to discover what exists and what is still fake, static, partially wired, broken, or disconnected.

---

## Core Mission

Perform a full autonomous audit of the existing dashboard/admin system and then progressively activate it.

Your job is to:

1. discover every dashboard screen, sub-screen, module, action area, tab, list, form, drawer, modal, icon action, button, nested control, search input, filter, reorder control, and settings panel that exists in code
2. determine what is already functional
3. determine what is only visual / placeholder / fake
4. determine what is partially wired
5. determine what is missing data connection
6. implement the missing functionality where appropriate for MVP
7. connect admin changes to the public website wherever applicable
8. make the system truthful: if something looks interactive, it should either work, be explicitly disabled, or be removed from MVP

Do not wait for perfect final backend architecture if a practical MVP data layer can be implemented safely now.
Build truthfully and incrementally.

---

## Required Working Style

You must reason from the project itself, not from assumptions.

Inspect:

- folder structure
- routes
- admin pages
- shared data files
- contexts
- hooks
- local state
- persistence utilities
- config files
- existing service abstractions
- public site consumption of content/theme/project/settings data
- current AI/chat UI and any existing save logic

Then create your own internal map of:

- existing admin modules
- existing public-site-controlled entities
- existing editable structures
- existing persistence approach
- missing links between admin and public site

---

## Truthful Functional Standard

Any visible admin/dashboard control that appears interactive should be treated as one of these:

- functional
- partially functional
- static placeholder
- misleading fake control
- blocked by missing data layer
- blocked by missing route/action wiring

For MVP, your duty is to eliminate misleading fake controls as much as possible by:

- wiring them up
- disabling them honestly
- removing them from the interactive path if they cannot safely work yet

Do not leave decorative fake interactivity where users expect real control.

---

## Functional Audit Scope

Audit the entire admin/dashboard area and all related control surfaces, including:

- main navigation
- nested navigation
- topbar actions
- notifications
- settings screens
- content/section management
- project management
- logo/media/social controls
- CRM / leads / users / tickets
- AI/chat controls
- system/config screens
- search
- filters
- sort
- bulk actions
- row actions
- icon-only actions
- modals and drawers
- save/apply/deploy buttons
- reorder interactions
- visibility toggles
- tabs and segmented controls
- any hidden but reachable internal panel
- any page or module present in the code but not fully completed visually yet

You must inspect what exists in code, not only what is visible in screenshots.

---

## Activation Principles

For every meaningful admin interaction you find, verify 3 things:

### 1. UI Layer

Does the control exist visually and respond?

### 2. Data / State Layer

Does it read/write meaningful state or persistence?

### 3. Public Effect Layer

Does it create a real effect on:

- the admin data model
- or the public website
- or the CRM / AI / project system
- or the related workflow it claims to control?

If the answer is no, fix it.

---

## Public Site Connection Requirement

A major requirement:
admin changes must create real effect on the public website where relevant.

That includes things like:

- appearance/theme changes
- content edits
- section visibility/order
- social link changes
- logo changes
- metrics/stat changes
- project/case study updates
- testimonials
- AI behavior settings
- anything else the public site consumes

Do not leave admin state isolated in fake local UI if the public site is supposed to use it.

---

## Persistence Requirement

Use the safest realistic MVP persistence strategy that fits the current project state.

If the full final backend is not fully finished, you may implement or improve a practical intermediate layer, but it must be:

- centralized
- reusable
- scalable
- not random scattered component state
- not hardcoded per page

Prefer:

- shared data service
- shared admin store / provider
- structured config/state persistence
- route-aware state usage
- clean abstractions ready for later backend evolution

Do not block activation waiting for “perfect future architecture.”
Make the current MVP real.

---

## Appearance / Theme / Website Control

Anything in the dashboard that claims to control:

- theme
- colors
- typography
- layout
- section visibility
- section order
- text
- media
- social links
- project showcases
- logos
- testimonials
- metrics
  must become truly functional and affect the public site if that connection is intended.

If there are save/apply/deploy style controls:

- make them meaningful
- or replace them with truthful behavior
- or disable them honestly if not safe yet

Do not leave fake “deploy” language if nothing deploys.

---

## AI / Chat / CRM Requirement

Inspect the current AI-related and CRM-related admin surfaces and make them meaningfully functional for MVP.

This includes:

- AI settings
- quick replies
- knowledge base
- conversation management
- lead linkage
- user/contact records
- ticket status/actions
- search/filter/sort
- relation visibility between entities

If a relation is intended by the system design, wire it in a practical MVP-safe way.

---

## Reorder / Sorting / Controls

If reorder controls exist:

- make them actually affect order
- persist the order meaningfully

If sorting/filter/search exist:

- make them actually work on the relevant dataset
- not just visually toggle buttons

If row actions exist:

- make them perform real operations
- or disable/remove them honestly

---

## Safety Rules

- Do NOT rebuild the dashboard from scratch
- Do NOT break the existing public site
- Do NOT fake critical functionality
- Do NOT leave dangerous system actions deceptively clickable if they do nothing
- If something cannot be safely implemented now, disable it explicitly and explain it in the summary
- Prefer truthful MVP functionality over decorative polish

---

## Execution Strategy

Work in phases, but decide the exact module grouping based on what actually exists in the codebase.

Recommended internal flow:

1. inspect and map the current admin system
2. identify fake/static controls
3. activate the most foundational modules first
4. connect them to the public site or shared data layer
5. continue module by module until the dashboard becomes operational

Do not spread thinly.
Fully activate one meaningful cluster at a time.

---

## Expected Deliverables

As you work, provide milestone summaries.

For each activated cluster/module, summarize:

- what existed
- what was fake/static
- what is now functional
- what data/state layer it is wired to
- what public/admin effect it now has
- what remains intentionally deferred

At the end, provide:

1. a final audit summary
2. a list of dashboard areas now fully functional
3. a list of controls intentionally disabled or deferred
4. the files/components/services/stores/routes you created or edited
