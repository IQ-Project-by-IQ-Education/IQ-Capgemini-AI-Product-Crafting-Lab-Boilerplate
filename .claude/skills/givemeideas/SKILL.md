---
name: givemeideas
description: >
  Use this skill when the user types "/givemeideas", "$givemeideas",
  "give me ideas", "show app ideas", or asks for Capgemini COMEX Build
  Challenge app inspiration.
---

<!-- Claude Code entry point. The real instructions are shared with Codex and live in
     .agents/skills/givemeideas/ — edit them there, not here. If you change the skill's name
     or description there, copy it into this file's header too. -->

Read `.agents/skills/givemeideas/SKILL.md` (from the project root) and follow it exactly, as if its content were written here. Any scripts or files it mentions are in `.agents/skills/givemeideas/`.

These instructions were first written for Codex. When they say "Codex", read it as you (Claude Code):
- Codex file tools → your Read / Edit / Write tools.
- Codex terminal tool → your Bash tool (on Windows, call `powershell.exe -NoProfile -Command "..."` through it when PowerShell is required). For long commands, set the Bash timeout to the maximum (600000 ms) or run the command in the background and check on it.
- "Approve for me" / default shell access on Codex → Claude Code's permission mode. Report whether commands ran without a permission prompt (for example auto-accept / bypass permissions mode, or allowed commands in settings) or whether each one needed approval.
- Codex web search → your WebSearch / WebFetch tools.
- Codex in-app browser / preview tool → any browser tool you have (for example Claude in Chrome or Playwright); if none is available, check the page with `curl` and say so.
