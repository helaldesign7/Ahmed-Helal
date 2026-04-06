# Full System Verification, Wiring, and Live-Effect Audit Prompt

Read the attached architecture/project file carefully and use it as context, but do not rely on description alone.
You must inspect the actual codebase and verify the real implementation.

This project is already built and already connected to multiple systems.
Do NOT start from scratch.
Do NOT redesign the project.
Do NOT stop at surface-level UI review.

Your job is to perform a full technical audit, fix anything broken or incomplete, and verify that the entire system works correctly end-to-end.

---

## Main Goal

I need you to verify and complete the real functional behavior of the project so that nothing important is left fake, disconnected, or only presentational.

You must ensure that:

1. the app runs correctly
2. the codebase structure and execution flow are correct
3. the AI chat works correctly
4. the AI chat is actually connected to Gemini using the API key
5. the AI chat can return real responses
6. submitting "Start a Project" / "New Project" actually sends an email to my email
7. admin dashboard changes are actually applied to the public website for all visitors
8. those changes are not only local visual state, but reflected in the real shared data flow
9. any admin edit to content, settings, sections, appearance, links, projects, testimonials, metrics, logos, or AI settings has real effect on the website
10. the public site reflects updates for logged-in and non-logged-in visitors
11. a refresh may be acceptable after updates, but the public site must reflect the new state after refresh if real-time sync is not already implemented

---

## Working Style Requirements

You must not assume anything.
You must verify everything from the codebase itself.

Inspect:

- project structure
- package.json
- scripts
- environment variable usage
- Netlify functions
- Supabase integration
- auth context
- admin context
- public site data flow
- AI chat components
- email sending path
- dashboard modules
- route guards
- persistence logic
- shared content/state services
- any localStorage fallback logic
- any fake or placeholder admin actions

If something appears connected but is actually fake, treat it as broken and fix it.

---

## Phase 1 — Runtime and Build Verification

First verify the project can run properly.

You must:

1. inspect the package manager actually used by the project
2. install dependencies correctly using the existing package manager only
3. run the correct local dev command
4. run a production build check
5. identify build errors, runtime errors, type errors, and important warnings
6. fix the important ones
7. explain which warnings can be safely ignored and which cannot

At the end of this phase, summarize:

- how the project is started
- whether it builds successfully
- what was broken and what you fixed

---

## Phase 2 — AI Chat Verification

You must fully audit the AI assistant.

Verify and fix all of the following:

1. the AI chat opens correctly
2. the message flow works correctly
3. it is actually calling Gemini, not simulating a response
4. it uses the API key correctly
5. it handles missing or invalid key states gracefully
6. it returns real replies
7. it uses the intended assistant personality / knowledge base
8. it does not break due to frontend-only secret misuse
9. it does not rely on fake hardcoded placeholder responses
10. it behaves correctly in Arabic and English if the system supports both

You must inspect the exact path used by the AI:

- frontend direct call?
- backend function?
- env usage?
- runtime config?

If the current approach is insecure or broken, fix it using the safest practical MVP architecture already compatible with the project.

At the end of this phase, summarize:

- where the AI key is read from
- how Gemini is called
- whether responses are real
- what files were changed
- any remaining limitation

---

## Phase 3 — Start Project / New Project Submission Verification

You must fully audit the project inquiry form.

Verify and fix all of the following:

1. the public Start a Project / New Project form opens correctly
2. validation works
3. submitting the form does not silently fail
4. the submission is actually sent to my email
5. the email path is real and working
6. the project inquiry is saved in the system as a lead / request
7. the success message is truthful
8. the failure state is truthful
9. the submission data structure is meaningful and complete

You must inspect:

- whether Netlify Functions exist
- whether nodemailer or another mail transport exists
- whether the function is actually called from the form
- whether SMTP env variables are used correctly
- whether the submission is also saved into dashboard / CRM data

If the current behavior is simulation only, you must replace it with real functionality.

At the end of this phase, summarize:

- exact file/function used for mail sending
- whether email sending is real now
- whether submissions are saved to CRM
- what files were edited

---

## Phase 4 — Dashboard Functional Truth Audit

You must inspect the admin dashboard in depth and verify that it is not just a visual mock interface.

Audit every important area:

- appearance
- content sections
- projects
- testimonials
- logos
- metrics
- social links
- AI settings
- CRM / leads / users / tickets
- system settings
- notifications
- admin-only routes
- any nested editor or manager screen

For each dashboard control, determine whether it is:

- working
- partially wired
- fake / static
- broken
- disconnected from public site effect

Then activate or fix it.

Important rule:
If something looks interactive, it must either:

- truly work
- be explicitly disabled
- or be removed from the active UX if it is fake

Do not leave misleading fake controls.

---

## Phase 5 — Public Site Live Effect Verification

The most important business requirement:

When I am logged in as admin and change anything in the dashboard, that change must affect the public website for everyone who opens it.

This includes changes to:

- hero content
- text
- section visibility
- section order
- project data
- case study content
- social links
- testimonials
- metrics
- logos
- AI settings that affect public assistant behavior
- appearance / theme settings where already designed to be global
- any editable section content

You must verify whether this is currently:

- local-only
- browser-only
- partially shared
- fully shared through backend/cloud persistence

If it is not truly shared, fix the data flow.

Acceptable public effect behavior:

- instant if already possible
- or visible after refresh if the project currently uses fetch-on-load shared persistence

Not acceptable:

- admin sees the change but visitors do not
- localStorage-only pretending to be global
- fake save success without public effect

At the end of this phase, summarize:

- which dashboard modules now truly affect the public site
- whether refresh is required for public visitors
- what storage/persistence layer is used
- what remains deferred

---

## Phase 6 — Auth and Access Verification

Verify:

1. admin-only areas are protected
2. the admin login flow actually works
3. the current auth architecture matches the project's intended persistence layer
4. dangerous write actions are not left open to guests
5. if Supabase is used, the write flows respect authenticated admin access
6. if local-only auth is still being used where it should not be, fix it or clearly isolate/defer it safely

Do not claim the admin is secure unless it really is.

---

## Phase 7 — Data Layer and Persistence Verification

Inspect the real source of truth for:

- projects
- leads
- site settings
- AI settings
- section settings
- appearance settings
- logos
- testimonials
- metrics
- social links

Determine whether they are stored in:

- local state
- localStorage
- Supabase
- Netlify Function + DB
- JSON/config files
- mixed sources

Then normalize the architecture enough for a truthful MVP.

Goal:
The dashboard should not look cloud-connected while actually being fake/local-only unless that is made explicit.

If Supabase already exists in the project, use it properly.
If only some modules are connected and others are not, finish the wiring for the critical modules.

---

## Phase 8 — Final End-to-End Verification

After all fixes, verify with real proof:

1. local dev runs
2. production build succeeds
3. AI chat returns real Gemini responses
4. Start Project sends real email
5. lead appears in dashboard / CRM
6. admin can change a public-facing setting/content/module
7. public site reflects that change
8. auth restrictions behave correctly

Do not just say “done”.
Show evidence from code paths and actual behavior.

---

## Output Requirements

Work in phases and give milestone summaries.

For each phase, summarize:

- what you inspected
- what was broken
- what was fake
- what you fixed
- what files were created or edited
- how you verified the result

At the very end provide:

1. final technical audit summary
2. list of fully verified systems
3. list of systems still partial or deferred
4. exact commands used
5. exact files/functions responsible for:
   - AI
   - email sending
   - dashboard persistence
   - public data rendering
6. clear statement on whether the system is truly working end-to-end

---

## Hard Rules

- Do NOT start from scratch
- Do NOT redesign the app visually unless required by functionality
- Do NOT leave fake controls pretending to work
- Do NOT assume a feature is working without verifying the actual code path
- Do NOT stop at lint cleanup or surface polish
- Focus on real functional correctness and real public effect
