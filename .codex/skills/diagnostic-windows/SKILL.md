---
name: diagnostic-windows
description: >
  Use this skill when the user types "/diagnostic-windows", "$diagnostic-windows",
  "windows diagnostic", "diagnostic for windows", "run Windows diagnostic", or
  asks whether a Capgemini Windows computer is ready for product crafting: using
  PowerShell, reading and editing files, searching the web, downloading
  dependencies, running the app, and previewing the result.
---

# Diagnostic Windows

Run a technical readiness diagnostic for helpers, not for COMEX builders.

The goal is to verify that the builder's Capgemini Windows computer is not blocked by local restrictions and can perform the work needed during the Build Challenge.

For this challenge, "ready for product crafting" means Codex can do the practical loop a helper needs: understand a plain-language idea, inspect and change project files, search the web when current information is needed, download project dependencies, run checks, start the app, open the preview, and test visible behavior.

The final answer must be a copy-paste checklist that can be sent or shown to the IQ Project team.

Rules:
- Run the checks yourself and record real evidence.
- The output can be technical. It is for helpers and IQ Project, not for the builder.
- Return a checklist that can be copied as-is.
- This is a check/report only for the machine and system tools (Node.js, Python, Git). Do not install those, do not change settings, and do not fix the machine during `/diagnostic-windows`.
- Downloading the project's own dependencies is part of the check, not a fix. Run a harmless registry check first (`npm view next version`), then run `npm install` (or `pnpm install` / `yarn` if that is the project's package manager) automatically whenever `npm ls` shows packages missing or incomplete. Do not wait for the helper to ask. After the install finishes, re-run the checks that depend on it (`npm run preflight`, `npm run dev`, the preview check) and record the real result instead of the earlier failure.
- Do not ask the builder to troubleshoot.
- Do not create git commits.
- Do not test external cloud services or ask for accounts.
- Do not claim that "all tools" work. State exactly what was tested and what is blocked.
- Prefer Windows PowerShell checks because Capgemini builder computers are expected to run Windows.
- If PowerShell is unavailable, try Command Prompt checks and report that PowerShell must be allowed.
- Git, Git Bash, the Unix-style tools it provides (grep, sed, head, tail, wc), pnpm, yarn, and WSL are all optional for this starter. Still test and report them, but do not let any of them block a `READY` result by themselves. Restricted commands that are not part of the core loop (for example `tasklist`, or a single `Get-ChildItem Env:` failure) are informational only and must not block `READY` either.
- Mark the system `READY` if: Codex can read and edit project files; PowerShell (or Command Prompt as fallback) runs terminal commands; web search works when needed; Node.js and npm are present; Python 3.12+ is present and working; the project's dependencies install successfully (`npm install` completes and `npm ls` is clean); `npm run preflight` and `npm run dev` both succeed; and the local preview loads in the browser/in-app preview tool. That is the full set — everything else tested (Git, Unix tools, WSL, tasklist, env listing, etc.) is reported for completeness but does not change the verdict.
- Mark the system `NEEDS ATTENTION` only if one of those required items above is actually blocked: file access, file editing, terminal command execution, Node.js, npm, Python 3.12+, dependency install, app startup, local preview, browser/in-app preview, or web search when the session requires current information.
- If something is missing or blocked, write what Capgemini should activate, install, allow, or whitelist. The report is meant to be sent or shown to IQ Project.

Check:
1. Correct project folder is open.
2. Project files can be read.
3. Codex can run PowerShell commands commonly needed while building, checking, and previewing the app.
4. Command Prompt is available as a fallback, if relevant.
5. Terminal commands run without per-command approval. Note whether default shell access with "Approve for me" is enabled on Codex, or whether every command required a manual approval prompt. Constant per-command approval is a blocker for the Build Challenge and must be reported.
6. Node.js is installed and available with `node -v`.
7. npm is installed and available with `npm -v`.
8. Git is installed and available with `git --version`, and public repositories can be pulled. A harmless check such as `git ls-remote https://github.com/vercel/next.js HEAD` is enough; do not clone anything into the project. This is critical on Windows: Git for Windows also provides Git Bash and the Unix-style tools some lab commands need. If Git is missing, report that it must be installed from https://git-scm.com/install/windows.
9. Unix-style CLI tools are available: `grep`, `sed`, `head`, `tail`, `wc`. These are missing on plain Windows; they normally come from Git Bash (Git for Windows). Test them through Git Bash if it is available (`bash -lc "grep --version"` and similar). If they are missing, report that installing Git for Windows (https://git-scm.com/install/windows) provides them.
10. Optional package runners/managers can be checked if relevant: `npx --version`, `pnpm -v`, `yarn -v`.
11. Python 3.12 or newer is installed and available (Python 3.14.x preferred). Confirm `python --version` or `python3 --version` works from the command window (PowerShell or Command Prompt) or Git Bash, and `pip --version` (or `pip3 --version` / `python -m pip --version`) works too. `py --version` is an acceptable extra check on Windows. Report the exact version found and whether it meets the 3.12+ requirement. This is critical: the boilerplate asks for Python when a participant's app needs to initialize its database, so a missing or too-old Python is a blocker.
12. Install the project's dependencies before testing anything that depends on them. Check `node_modules` and `package-lock.json`, then run a harmless registry check (`npm view next version`). If `npm ls` shows anything missing or incomplete, run `npm install` (or `pnpm install` / `yarn`) right away and re-run `npm ls` to confirm it is clean. Do this before check 13, so the npm scripts below are tested against a fully installed project instead of failing on missing packages.
13. npm scripts can run from the now fully-installed project folder: `npm run dev`, `npm run build`, `npm run lint`, `npm run preflight`.
14. Codex can write inside the project when needed (shell write access in the project folder: create, copy, move, and remove a temporary diagnostic file).
15. Codex can edit an existing project file when needed. For the diagnostic itself, do not leave real project edits behind; use a temporary diagnostic file unless the helper asked to remake this skill.
16. The readiness check passes: `npm run preflight`.
17. The app can run with `npm run dev`.
18. The app can start with `npm start` after a successful production build if needed.
19. The local preview is reachable at `http://localhost:3000` (expect HTTP 200), or at the alternate port chosen by the app if port 3000 is already busy.
20. Codex file tools can read and edit project files.
21. Codex terminal execution tool works for project commands.
22. A browser or in-app preview tool is available.
23. The browser or in-app preview tool can load the app page.
24. Web search / browser search is available when the app build needs up-to-date information.
25. If the app saves information, Codex can test save, refresh, and reload behavior.
26. Any permission, sandbox, network, browser, web search, command approval, Node.js, npm, Git, Git Bash, or Python restriction is clearly listed.

Windows command guidance:
- Prefer `powershell.exe -NoProfile -Command "<command>"` or `pwsh -NoProfile -Command "<command>"` when available.
- If PowerShell is blocked, use `cmd.exe /c "<command>"` only as a fallback and report the PowerShell restriction.
- Use PowerShell-safe commands in the report:
  - Current folder: `Get-Location`
  - Move folders: `Set-Location`
  - Date/time: `Get-Date`
  - List files: `Get-ChildItem`
  - Read file: `Get-Content`
  - Search text: `Select-String`
  - Find files: `Get-ChildItem -Recurse`
  - Create folder: `New-Item -ItemType Directory`
  - Create file: `New-Item -ItemType File`
  - Copy: `Copy-Item`
  - Move/rename: `Move-Item`
  - Remove temporary diagnostic files only: `Remove-Item`
  - Command lookup: `Get-Command`
  - Environment: `Get-ChildItem Env:`
  - Processes: `Get-Process`
  - Port check: `Get-NetTCPConnection -LocalPort 3000`, if available
  - Web request: `Invoke-WebRequest -Uri http://localhost:3000 -Method Head`, or `curl.exe -I http://localhost:3000`
- Use Command Prompt-safe fallback commands in the report:
  - Current folder: `cd`
  - List files: `dir`
  - Read file: `type`
  - Search text: `findstr`
  - Command lookup: `where`
  - Environment: `set`
  - Processes: `tasklist`
  - Port check: `netstat -ano`
  - Web request: `curl.exe -I http://localhost:3000`
- On Windows, use `curl.exe` when checking preview reachability. `curl` can be a PowerShell alias for `Invoke-WebRequest`.
- Python check caution: on Windows, a bare `python` command can be a Microsoft Store stub that prints nothing or opens the Store instead of running Python. If `python --version` returns no version, also try `python3 --version` and `py --version` before concluding Python is missing, and report the stub if that is what was found.
- If Git Bash is available, also confirm `python --version` and `pip --version` work from Git Bash, since some sessions use it.
- Use Git Bash (`bash -lc "<command>"`) for the Unix-style tool checks (grep, sed, head, tail, wc) and as a second place to confirm python and pip. Use WSL only as optional evidence when a session expects it.

Use this output format exactly:

```text
CAPGEMINI BUILD CHALLENGE - WINDOWS TECHNICAL DIAGNOSTIC

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

[ ] Windows PowerShell commands needed for app development work
Commands tested:

Project/navigation:
- Get-Location
- Set-Location
- Get-Date
- Get-ChildItem
- Get-ChildItem -Recurse

File reading and search:
- Get-Content
- Codex Read/file inspection tool
- Select-String
- Measure-Object
- Sort-Object
- Get-Item
- Get-ItemProperty

File and folder operations:
- New-Item (temporary diagnostic files only)
- Copy-Item (temporary diagnostic files only)
- Move-Item (temporary diagnostic files only)
- Remove-Item (temporary diagnostic files only; never app/user files)

Environment and process checks:
- Get-Command
- Get-ChildItem Env:
- Get-Process
- Get-NetTCPConnection -LocalPort 3000, if available

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
- python --version or python3 --version (also py --version if needed)
- pip --version or pip3 --version or python -m pip --version

Preview/network checks:
- Invoke-WebRequest -Uri http://localhost:3000 -Method Head
- curl.exe -I http://localhost:3000
Evidence:

[ ] Command Prompt fallback works, if PowerShell is blocked or limited
Commands checked:
- cmd.exe /c cd
- cmd.exe /c dir
- cmd.exe /c type package.json
- cmd.exe /c where node
- cmd.exe /c where npm
- cmd.exe /c tasklist
- cmd.exe /c netstat -ano
- cmd.exe /c curl.exe -I http://localhost:3000
Evidence:

[ ] Git is installed and can pull public repositories
Commands tested:
- git --version
- git ls-remote against a public repository (read-only; no clone into the project)
Version found:
Public repo pull access: yes/no
If missing: install Git for Windows from https://git-scm.com/install/windows
Evidence:

[ ] Unix-style CLI tools are available (grep, sed, head, tail, wc)
Important: these are missing on plain Windows; Git Bash (Git for Windows) provides them.
Commands tested:
- bash --version (Git Bash present: yes/no)
- grep, sed, head, tail, wc through Git Bash
If missing: install Git for Windows from https://git-scm.com/install/windows
Evidence:

[ ] WSL availability, optional
Important: WSL is optional on Capgemini Windows machines; do not mark not ready because of it.
Command checked only if relevant:
- wsl --status
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
- run short PowerShell or terminal commands
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

[ ] Optional package runners/managers are available if needed
Commands checked:
- npx --version
- pnpm -v
- yarn -v
Evidence:

[ ] Python 3.12 or newer is installed and available (3.14.x preferred)
Commands tested:
- python --version or python3 --version (also py --version if needed)
- pip --version or pip3 --version or python -m pip --version
- works from the command window (PowerShell or Command Prompt): yes/no
- works from Git Bash, if Git Bash is available: yes/no/not available
Python version found:
Meets 3.12+ requirement: yes/no
Is 3.14.x (preferred): yes/no
pip works: yes/no
Microsoft Store stub detected instead of real Python: yes/no
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
  - Install or allow Python 3.12 or newer (3.14.x preferred) with pip, available as python or python3 from the command window and Git Bash
  - Install Git for Windows from https://git-scm.com/install/windows (also provides Git Bash and the Unix-style tools grep, sed, head, tail, wc) and allow pulling public repositories
  - Enable default shell access with "Approve for me" on Codex so commands run without per-command approval
  - Allow Windows PowerShell command execution
  - Allow Command Prompt as a fallback
  - Allow project/navigation commands: Get-Location, Set-Location, Get-Date, Get-ChildItem
  - Allow file reading and search commands: Get-Content, Codex Read/file inspection tool, Select-String, Measure-Object, Sort-Object, Get-Item
  - Allow file and folder operation commands: New-Item, Copy-Item, Move-Item, Remove-Item for temporary diagnostic cleanup only
  - Allow environment and process check commands: Get-Command, Get-ChildItem Env:, Get-Process, Get-NetTCPConnection
  - Allow git commands: git --version, git status, git diff, git ls-remote (read-only pull check)
  - Allow preview/network check commands: Invoke-WebRequest and curl.exe
  - Allow reading and writing inside the project folder
  - Allow package registry access for dependency checks and downloads
  - Allow running npm scripts: npm run dev, npm run build, npm run lint, npm run preflight, npm start
  - Allow local preview on http://localhost:3000 and alternate local ports if 3000 is busy
  - Allow browser or in-app preview access
  - Allow Codex web search / browser search if up-to-date information is needed
  - Allow npm install, pnpm install, or yarn if dependencies are missing
  - Allow WSL only if a specific session requires it

Report recipient:
- IQ Project

Final result:
READY for the Build Challenge / NOT READY yet
```
