# Project Setup, GitHub & Netlify Guide Prompt v1

You are working inside an existing React + Vite + TypeScript project with an admin dashboard, AI assistant, and multiple sections.

The user is not asking you to build anything new right now.

Your task is to deeply inspect the current project and explain, step-by-step, how to:

1. Run the project locally correctly
2. Fix any current errors preventing proper execution
3. Initialize and connect the project to GitHub properly
4. Use Git correctly for future updates
5. Deploy the project to Netlify
6. Ensure future changes automatically update the live site

---

## IMPORTANT RULES

- Do NOT assume a generic setup
- Inspect the actual project structure, scripts, and dependencies
- Use the current files (package.json, folders, configs) as the source of truth
- If something is wrong or missing, point it out clearly
- If something is already correct, confirm it
- Do NOT give vague explanations — be practical and actionable

---

## 1. Local Project Setup

Explain:

- What commands the user should run to start the project
- Whether to use npm, pnpm, or yarn (based on the project)
- If dependencies are missing, explain how to install them
- How to run dev server
- What URL should open (like localhost:5173)

Also:

- Detect and explain any current errors (like unused variables, config issues, etc.)
- Tell the user if those errors matter or can be ignored

---

## 2. Environment Variables (.env)

Analyze the current .env usage and explain:

- Which variables are actually used
- Which ones are unnecessary or unsafe
- Which ones must remain secret
- Which ones are exposed to frontend (VITE\_)

Also:

- Explain how these variables behave in development vs production
- Explain where to set them when deploying

---

## 3. Git Initialization & GitHub Setup

Based on the current state:

- Check if Git is initialized correctly
- Explain what the current branch is (main, etc.)
- Explain what changes are staged/unstaged

Then give exact steps to:

1. Initialize Git (if needed)
2. Commit current project properly
3. Connect to GitHub repository
4. Push the project

Provide both:

- Terminal commands
- VS Code UI method (Source Control)

---

## 4. Git Workflow (Very Important)

Explain clearly how the user should work daily:

When using Antigravity or editing code:

1. What to do after changes
2. How to commit properly
3. How to push updates

Also:

- Best commit message structure
- When to create multiple commits vs one

---

## 5. Netlify Deployment

Explain step-by-step:

1. How to connect GitHub repo to Netlify
2. What settings to use:

- Build command
- Publish directory

3. Where to put environment variables in Netlify
4. How deployment works after pushing to GitHub

---

## 6. Auto Deployment Flow

Explain clearly:

- What happens after:
  git push

- How Netlify rebuilds automatically
- How long it takes
- Where to monitor builds

---

## 7. Common Problems & Fixes

Based on the project, list:

- Possible deployment errors
- Environment variable issues
- Build failures
- Missing configs

And how to fix them

---

## 8. Final Checklist

Give a checklist like:

- [ ] Project runs locally
- [ ] Git connected
- [ ] Repo pushed
- [ ] Netlify connected
- [ ] Env variables set
- [ ] Site live
- [ ] Auto deploy working

---

## OUTPUT STYLE

- Clear steps
- Simple language
- No unnecessary theory
- Practical instructions only
- Use bullet points and sections

---

## GOAL

After your explanation, the user should be able to:

- Run the project without issues
- Push it to GitHub
- Deploy it on Netlify
- Update it anytime easily
