---
name: diagnostic
description: >
  Use this skill when the user types "/diagnostic", "$diagnostic",
  "run diagnostic", "technical diagnostic", "check the setup", or asks whether
  a Capgemini builder computer has the access needed to build, run Bash/terminal
  commands, use Codex tools, search the web when needed, and preview the app.
---

# Diagnostic

Run a technical readiness diagnostic for helpers, not for COMEX builders.

The goal is to verify that the builder's Capgemini computer is not blocked by local restrictions and can perform the work needed during the Build Challenge. The final answer must be a copy-paste checklist that can be sent or shown to the IQ Project team.

Rules:
- Run the checks yourself and record real evidence.
- The output can be technical. It is for helpers and IQ Project, not for the builder.
- Return a checklist that can be copied as-is.
- This is a check/report only. Do not install missing tools, do not change settings, and do not fix the machine during `/diagnostic`.
- Do not ask the builder to troubleshoot.
- Do not create git commits.
- Do not test external cloud services or ask for accounts.
- Do not claim that "all tools" work. State exactly what was tested and what is blocked.
- If something is missing or blocked, write what Capgemini should activate, install, allow, or whitelist. The report is meant to be sent or shown to IQ Project.

Check:
1. Correct project folder is open.
2. Project files can be read.
3. Codex can run the Bash/terminal commands commonly needed while building, checking, and previewing the app.
4. Node.js is installed and available with `node -v`.
5. npm is installed and available with `npm -v`.
6. Optional package runners/managers can be checked if relevant: `npx --version`, `pnpm -v`, `yarn -v`.
7. npm scripts can run from the project folder.
8. Dependencies are already available. If not, report that `npm install`, `pnpm install`, or `yarn` must be allowed, but do not run install commands unless the helper explicitly asks.
9. Codex can write inside the project when needed.
10. The readiness check passes: `npm run preflight`.
11. The app can run with `npm run dev`.
12. The app can start with `npm start` after a successful build if needed.
13. The local preview is reachable at `http://localhost:3000`.
14. Codex file tools can read and edit project files.
15. Codex Bash/terminal execution tool works for project commands.
16. A browser or in-app preview tool is available.
17. The browser or in-app preview tool can load the app page.
18. Web search / browser search is available when the app build needs up-to-date information.
19. If the app saves information, Codex can test save, refresh, and reload behavior.
20. Any permission, sandbox, network, browser, web search, command, Node.js, or npm restriction is clearly listed.

Use this output format exactly:

```text
CAPGEMINI BUILD CHALLENGE - TECHNICAL DIAGNOSTIC

Date/time:
Computer/user:
Project folder:
Overall status: READY / NEEDS ATTENTION

[ ] Project folder opened correctly
Evidence:

[ ] Project files readable
Evidence:

[ ] Bash/terminal commands needed for app development work
Commands tested:

Project/navigation:
- pwd
- cd
- date
- ls
- find

File reading and search:
- cat
- Codex Read/file inspection tool
- sed
- rg
- grep
- head
- tail
- wc
- sort
- uniq
- file
- stat

File and folder operations:
- mkdir
- touch
- cp
- mv
- rm (temporary diagnostic files only; never app/user files)

Environment and process checks:
- which
- command -v
- env
- printenv
- ps
- lsof

Git inspection only:
- git status
- git diff

Node and npm:
- node -v
- npm -v
- npx --version
- pnpm -v
- yarn -v
- npm install (availability only; do not run unless helper explicitly asks)
- pnpm install (availability only; do not run unless helper explicitly asks)
- yarn (availability only; do not run unless helper explicitly asks)
- npm ls
- npm run lint
- npm run build
- npm run preflight
- npm run dev
- npm start

Preview/network checks:
- curl -I http://localhost:3000
Evidence:

[ ] Codex file tools work
Capabilities tested:
- read project files
- edit project files
- create project files when needed
Evidence:

[ ] Codex Bash/terminal tool works
Capabilities tested:
- run short commands
- run npm scripts
- run a long-lived app preview command
Evidence:

[ ] Node.js is installed and available
Command tested:
- node -v
Evidence:

[ ] npm is installed and available
Command tested:
- npm -v
Evidence:

[ ] npm project commands are available
Commands tested:
- npm run lint
- npm run build
- npm run preflight
- npm run dev
- npm start, if the app has already been built and the preview port is free
Evidence:

[ ] Optional package runners/managers are available if needed
Commands checked:
- npx --version
- pnpm -v
- yarn -v
Evidence:

[ ] Project write access works
Check performed:
- create a temporary diagnostic file
- read it
- remove only that temporary diagnostic file
Evidence:

[ ] Dependencies are already available
Check performed:
- node_modules present: yes/no
- package-lock present: yes/no
Important: do not run npm install, pnpm install, or yarn during this diagnostic unless the helper explicitly asks.
Evidence:

[ ] Readiness check passes
Command tested:
- npm run preflight
Evidence:

[ ] App can start
Command tested:
- npm run dev
Evidence:

[ ] Preview reachable
URL:
Evidence:

[ ] Browser or in-app preview tool is available
Evidence:

[ ] Browser or in-app preview tool can load the app page
Evidence:

[ ] Web search / browser search tool is available
Check performed:
- Run a simple web search test only if web search is expected for the session.
- Do not use external services that require accounts.
Evidence:

[ ] Save/reload testing possible when the app has saved information
Evidence:

Restrictions detected:
- None / list exact blockers

Activations or allowances needed from Capgemini:
- None / list exact activation needed, for example:
  - Install or allow Node.js
  - Install or allow npm
  - Allow npx if one-off project tools are needed
  - Allow pnpm and yarn only if a project requires them
  - Allow Bash/terminal shell command execution
  - Allow project/navigation commands: pwd, cd, date, ls, find
  - Allow file reading and search commands: cat, Codex Read/file inspection tool, sed, rg, grep, head, tail, wc, sort, uniq, file, stat
  - Allow file and folder operation commands: mkdir, touch, cp, mv, rm for temporary diagnostic cleanup only
  - Allow environment and process check commands: which, command -v, env, printenv, ps, lsof
  - Allow git inspection commands only: git status, git diff
  - Allow preview/network check commands: curl
  - Allow reading and writing inside the project folder
  - Allow running npm scripts: npm run dev, npm run build, npm run lint, npm run preflight, npm start
  - Allow local preview on http://localhost:3000
  - Allow browser or in-app preview access
  - Allow Codex web search / browser search if up-to-date information is needed
  - Allow npm install, pnpm install, or yarn if dependencies are missing

Report recipient:
- IQ Project

Final result:
READY for the Build Challenge / NOT READY yet
```
