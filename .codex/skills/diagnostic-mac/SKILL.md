---
name: diagnostic-mac
description: >
  Use this skill when the user types "/diagnostic-mac", "$diagnostic-mac",
  "mac diagnostic", "diagnostic for mac", "run Mac diagnostic", or asks whether
  a Capgemini Mac is ready for product crafting: using zsh/Bash terminal
  commands, reading and editing files, searching the web, downloading
  dependencies, running the app, and previewing the result.
---

# Diagnostic Mac

Run a technical readiness diagnostic for helpers, not for COMEX builders.

The goal is to verify that the builder's Capgemini Mac is not blocked by local restrictions and can perform the work needed during the Build Challenge.

For this challenge, "ready for product crafting" means Codex can do the practical loop a helper needs: understand a plain-language idea, inspect and change project files, search the web when current information is needed, download project dependencies, run checks, start the app, open the preview, and test visible behavior.

The final answer must be a copy-paste checklist that can be sent or shown to the IQ Project team.

Rules:
- Run the checks yourself and record real evidence.
- The output can be technical. It is for helpers and IQ Project, not for the builder.
- Return a checklist that can be copied as-is.
- This is a check/report only for the machine and system tools (Node.js, Python, Git). Do not install those, do not change settings, and do not fix the machine during `/diagnostic-mac`.
- Downloading the project's own dependencies is part of the check, not a fix. Run a harmless registry check first (`npm view next version`), then run `npm install` (or `pnpm install` / `yarn` if that is the project's package manager) automatically whenever `npm ls` shows packages missing or incomplete. Do not wait for the helper to ask. After the install finishes, re-run the checks that depend on it (`npm run preflight`, `npm run dev`, the preview check) and record the real result instead of the earlier failure.
- Do not ask the builder to troubleshoot.
- Do not create git commits.
- Do not test external cloud services or ask for accounts.
- Do not claim that "all tools" work. State exactly what was tested and what is blocked.
- Prefer macOS Terminal checks using zsh or Bash.
- Git, the Unix-style tools (grep, sed, head, tail, wc), pnpm, and yarn are all optional for this starter. Still test and report them, but do not let any of them block a `READY` result by themselves.
- Mark the system `READY` if: Codex can read and edit project files; the terminal runs commands; web search works when needed; Node.js and npm are present; Python 3.12+ is present and working; the project's dependencies install successfully (`npm install` completes and `npm ls` is clean); `npm run preflight` and `npm run dev` both succeed; and the local preview loads in the browser/in-app preview tool. That is the full set — everything else tested (Git, Unix tools, etc.) is reported for completeness but does not change the verdict.
- Mark the system `NEEDS ATTENTION` only if one of those required items above is actually blocked: file access, file editing, terminal command execution, Node.js, npm, Python 3.12+, dependency install, app startup, local preview, browser/in-app preview, or web search when the session requires current information.
- If something is missing or blocked, write what Capgemini should activate, install, allow, or whitelist. The report is meant to be sent or shown to IQ Project.

Check:
1. Correct project folder is open.
2. Project files can be read.
3. Codex can run macOS terminal commands commonly needed while building, checking, and previewing the app.
4. Terminal commands run without per-command approval. Note whether default shell access with "Approve for me" is enabled on Codex, or whether every command required a manual approval prompt. Constant per-command approval is a blocker for the Build Challenge and must be reported.
5. Node.js is installed and available with `node -v`.
6. npm is installed and available with `npm -v`.
7. Git is installed and available with `git --version`, and public repositories can be pulled. A harmless check such as `git ls-remote https://github.com/vercel/next.js HEAD` is enough; do not clone anything into the project.
8. Unix-style CLI tools are available: `grep`, `sed`, `head`, `tail`, `wc` (standard on macOS; confirm they are not blocked).
9. Optional package runners/managers can be checked if relevant: `npx --version`, `pnpm -v`, `yarn -v`.
10. Python 3.12 or newer is installed and available (Python 3.14.x preferred). Confirm `python --version` or `python3 --version` works from the terminal, and `pip --version` or `pip3 --version` (or `python3 -m pip --version`) works too. Report the exact version found and whether it meets the 3.12+ requirement. This is critical: the boilerplate asks for Python when a participant's app needs to initialize its database, so a missing or too-old Python is a blocker.
11. Install the project's dependencies before testing anything that depends on them. Check `node_modules` and `package-lock.json`, then run a harmless registry check (`npm view next version`). If `npm ls` shows anything missing or incomplete, run `npm install` (or `pnpm install` / `yarn`) right away and re-run `npm ls` to confirm it is clean. Do this before check 12, so the npm scripts below are tested against a fully installed project instead of failing on missing packages.
12. npm scripts can run from the now fully-installed project folder: `npm run dev`, `npm run build`, `npm run lint`, `npm run preflight`.
13. Codex can write inside the project when needed (shell write access in the project folder: create, copy, move, and remove a temporary diagnostic file).
14. Codex can edit an existing project file when needed. For the diagnostic itself, do not leave real project edits behind; use a temporary diagnostic file unless the helper asked to remake this skill.
15. The readiness check passes: `npm run preflight`.
16. The app can run with `npm run dev`.
17. The app can start with `npm start` after a successful production build if needed.
18. The local preview is reachable at `http://localhost:3000` (expect HTTP 200), or at the alternate port chosen by the app if port 3000 is already busy.
19. Codex file tools can read and edit project files.
20. Codex terminal execution tool works for project commands.
21. A browser or in-app preview tool is available.
22. The browser or in-app preview tool can load the app page.
23. Web search / browser search is available when the app build needs up-to-date information.
24. If the app saves information, Codex can test save, refresh, and reload behavior.
25. Any permission, sandbox, network, browser, web search, command approval, Node.js, npm, Git, or Python restriction is clearly listed.

Mac command guidance:
- Prefer the current macOS shell (`zsh` by default, Bash if configured).
- Use safe, common macOS commands in the report:
  - Current folder: `pwd`
  - Move folders: `cd`
  - Date/time: `date`
  - List files: `ls`
  - Find files: `find`
  - Read files: `cat`, `sed`, `head`, `tail`
  - Search text: `rg`, `grep`
  - Count/sort/check files: `wc`, `sort`, `uniq`, `file`, `stat`
  - Create folder: `mkdir`
  - Create file: `touch`
  - Copy: `cp`
  - Move/rename: `mv`
  - Remove temporary diagnostic files only: `rm`
  - Command lookup: `which`, `command -v`
  - Environment: `env`, `printenv`
  - Processes: `ps`
  - Port check: `lsof -i :3000`
  - macOS info: `sw_vers`, `uname -a`
  - Web request: `curl -I http://localhost:3000`
- Use destructive commands only against temporary diagnostic files created for this report.

Use this output format exactly:

```text
CAPGEMINI BUILD CHALLENGE - MAC TECHNICAL DIAGNOSTIC

Date/time:
Computer/user:
Operating system:
Shell tested:
Project folder:
Overall status: READY / NEEDS ATTENTION

[ ] Project folder opened correctly
Evidence:

[ ] Project files readable
Evidence:

[ ] macOS terminal commands needed for app development work
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
- mkdir (temporary diagnostic folders only)
- touch (temporary diagnostic files only)
- cp (temporary diagnostic files only)
- mv (temporary diagnostic files only)
- rm (temporary diagnostic files only; never app/user files)

Environment and process checks:
- which
- command -v
- env
- printenv
- ps
- lsof -i :3000
- sw_vers
- uname -a

Git:
- git --version
- git status
- git diff
- git ls-remote against a public repository (read-only pull access check)

Node and npm:
- node -v
- npm -v
- npx --version
- pnpm -v
- yarn -v
- npm view next version, or equivalent harmless registry check
- npm install (run automatically if `npm ls` shows dependencies missing or incomplete; re-run the blocked checks afterward)
- pnpm install (run automatically if that is the project's package manager and dependencies are missing)
- yarn (run automatically if that is the project's package manager and dependencies are missing)
- npm ls
- npm run lint
- npm run build
- npm run preflight
- npm run dev
- npm start

Python:
- python --version or python3 --version
- pip --version or pip3 --version or python3 -m pip --version

Preview/network checks:
- curl -I http://localhost:3000
Evidence:

[ ] Core product-crafting abilities work
Capabilities tested:
- understand a plain-language app request
- search the web when current information is needed
- read project files
- edit project files
- create project files when needed
- run project commands
- download or verify access to dependencies
- start the app
- open and test the preview
Evidence:

[ ] Codex file tools work
Capabilities tested:
- read project files
- edit project files
- create project files when needed
Evidence:

[ ] Codex terminal tool works
Capabilities tested:
- run short zsh/Bash terminal commands
- run npm scripts
- run a long-lived app preview command
Evidence:

[ ] Terminal commands run without per-command approval
Check performed:
- note whether commands executed directly or each one required a manual approval prompt
- note whether default shell access with "Approve for me" is enabled on Codex
Runs without per-command approval: yes/no
Evidence:

[ ] Node.js is installed and available
Command tested:
- node -v
Version found:
Evidence:

[ ] npm is installed and available
Command tested:
- npm -v
Version found:
Evidence:

[ ] Git is installed and can pull public repositories
Commands tested:
- git --version
- git ls-remote against a public repository (read-only; no clone into the project)
Version found:
Public repo pull access: yes/no
Evidence:

[ ] Unix-style CLI tools are available
Commands tested:
- grep, sed, head, tail, wc
Evidence:

[ ] Optional package runners/managers are available if needed
Commands checked:
- npx --version
- pnpm -v
- yarn -v
Evidence:

[ ] Python 3.12 or newer is installed and available (3.14.x preferred)
Commands tested:
- python --version or python3 --version
- pip --version or pip3 --version or python3 -m pip --version
Python version found:
Meets 3.12+ requirement: yes/no
Is 3.14.x (preferred): yes/no
pip works: yes/no
Evidence:

[ ] Project write access works
Check performed:
- create a temporary diagnostic file
- read it
- remove only that temporary diagnostic file
Evidence:

[ ] Dependencies are already available or can be downloaded
Check performed:
- node_modules present: yes/no
- package-lock present: yes/no
- package registry reachable: yes/no
- if dependencies were missing or incomplete, ran npm install (or pnpm install / yarn) automatically, before testing any npm scripts below, and re-checked npm ls
Commands checked:
- npm view next version, or equivalent harmless registry check
- npm install, pnpm install, or yarn, run automatically when dependencies are missing or incomplete
Evidence:

[ ] npm project commands are available
Commands tested, against the now fully-installed project:
- npm run lint
- npm run build
- npm run preflight
- npm run dev
- npm start, if the app has already been built and the preview port is free
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
  - Install or allow Python 3.12 or newer (3.14.x preferred) with pip, available as python or python3 from the terminal
  - Install or allow Git and allow pulling public repositories
  - Enable default shell access with "Approve for me" on Codex so commands run without per-command approval
  - Allow macOS Terminal command execution with zsh or Bash
  - Allow project/navigation commands: pwd, cd, date, ls, find
  - Allow file reading and search commands: cat, Codex Read/file inspection tool, sed, rg, grep, head, tail, wc, sort, uniq, file, stat
  - Allow file and folder operation commands: mkdir, touch, cp, mv, rm for temporary diagnostic cleanup only
  - Allow environment and process check commands: which, command -v, env, printenv, ps, lsof, sw_vers, uname
  - Allow git commands: git --version, git status, git diff, git ls-remote (read-only pull check)
  - Allow preview/network check command: curl
  - Allow reading and writing inside the project folder
  - Allow package registry access for dependency checks and downloads
  - Allow running npm scripts: npm run dev, npm run build, npm run lint, npm run preflight, npm start
  - Allow local preview on http://localhost:3000 and alternate local ports if 3000 is busy
  - Allow browser or in-app preview access
  - Allow Codex web search / browser search if up-to-date information is needed
  - Allow npm install, pnpm install, or yarn if dependencies are missing

Report recipient:
- IQ Project

Final result:
READY for the Build Challenge / NOT READY yet
```
