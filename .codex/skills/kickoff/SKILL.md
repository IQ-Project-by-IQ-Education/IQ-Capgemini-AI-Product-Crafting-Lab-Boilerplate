---
name: kickoff
description: >
  Use this skill when the user types "/kickoff", "$kickoff", "kick off",
  "start the challenge", "start the app", or asks Codex to prepare, install,
  run, fix, and preview the Capgemini Build Challenge starter.
---

# Kickoff

Prepare the project and open a working preview for the participant.

Rules:
- Run the setup yourself.
- Do not create git commits.
- Keep the user updated in plain language.
- Do not ask the participant to troubleshoot.
- If something fails, inspect the error, fix the project when possible, and try again.
- Keep looping until the app runs and the preview link works, unless a machine restriction makes that impossible.
- If the blocker is a machine restriction, report exactly what Capgemini needs to allow.

Workflow:
1. Confirm the project folder is open.
2. Run `npm install`.
3. Run `npm run preflight` to catch obvious issues.
4. Start the app with `npm run dev`.
5. Open or refresh the app preview at `http://localhost:3000`.
6. Confirm the page loads.
7. Tell the user: `Your app is open here: [link](http://localhost:3000)`.

If `npm install` fails:
- Read the error.
- If it is a package or lockfile issue, fix the project and retry.
- If it is a machine, network, permission, or security restriction, do not invent a workaround. Report the exact restriction and what Capgemini should allow.

If `npm run preflight` fails:
- Read the error.
- Fix the project files.
- Run `npm run preflight` again.

If `npm run dev` fails:
- Read the error.
- If the port is already in use, reuse the running app if it is this project, or start on another available port and give that link.
- If a new page or route is not appearing, restart the app.
- Fix project errors and retry until the preview works.

If the preview fails:
- Check the app is still running.
- Check the URL.
- Use the browser or in-app preview tool to load the page.
- Fix any visible issue and retry.
