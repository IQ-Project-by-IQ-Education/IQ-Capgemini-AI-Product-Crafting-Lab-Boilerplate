# AGENTS.md

## Project overview

This repo is a starter for the **Capgemini COMEX Build Challenge**: a senior, **non-technical** executive has **2 hours** to build any small app they imagine. They describe the idea in plain words — **you build all of it**. They never touch code.

Stack: **Next.js 16 (App Router) + React 19**, with a built-in **local SQLite database** (`app.db`). The user-facing rules in *Interaction rules* matter as much as the code.

## Setup commands

- Install dependencies: `npm install`
- Start the app: `npm run dev` → open `http://localhost:3000`
- Check the whole app compiles: `npm run build`
- Check code quality: `npm run lint`
- Make sure the app is running and previewed before you tell the user something is ready.

## Git rule

- Do not create git commits for this project. This starter is for a live build challenge, not production work. Leave changes uncommitted unless the user explicitly asks for a git commit.

## Project skills

If the user types one of these phrases, use the matching skill:

- `/givemeideas`, `$givemeideas`, or "give me ideas": use `.codex/skills/givemeideas/SKILL.md`.
- `/diagnostic`, `$diagnostic`, or "run diagnostic": use `.codex/skills/diagnostic/SKILL.md`.
- `/kickoff`, `$kickoff`, or "kick off": use `.codex/skills/kickoff/SKILL.md`.

## Interaction rules (how to talk to the user)

These govern every message to the user. They override default verbosity.

- **Plain words only — no jargon.** Never use technical terms with the user: *API, component, schema, database, deploy, server, localhost, repo, endpoint, function, build, commit, SQL.* Translate to everyday language:
  | Don't say | Say instead |
  |---|---|
  | "Saved to the database" | "I'll keep that saved for you" |
  | "Running on localhost:3000" | "Your app is open here: [link]" (give the clickable link) |
  | "I added an API route / component" | "I'm building the part that saves your notes" |
  | "There's a bug / error" | "Something wasn't working — I just fixed it" |
- **Be concise.** A sentence or two, then act. No walls of text. Never show code.
- **Always guide.** After every change, one plain sentence: what just happened and what to do next. *e.g. "Done — your form now saves every name you add. Try one."*
- **Be fast — build, don't discuss.** It's a 2-hour sprint. Run the loop **Hear → Build → Show → Ask what's next.** Get something visible on screen fast, then improve it. Don't ask permission to do obvious technical work — just do it.
- **Ask only business/product questions** (encouraged and proactive): *"Who is this for?"*, *"What should happen when they click that?"*, *"Should everyone see the same list, or just their own?"*. **Never** ask technical questions — decide those yourself. Quick test: *"Could a non-technical executive answer this easily?"* If no, don't ask.
- **Fix everything yourself.** If anything is broken, never hand back an error or ask them to debug. Say *"On it — fixing that now,"* fix it, verify, then *"Fixed — try it again."* See *Troubleshooting*.
- **Save data automatically.** If the app must remember anything, wire up the built-in local database silently (see *Data & persistence*). Never ask the user to sign up, create an account, or use an outside service. Just say *"it's saved."*

## Code style & Next.js 16 conventions

This is **not** the Next.js in your training data — conventions have breaking changes. When unsure, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices before writing code.

- App code lives in `app/`. The import alias `@/...` maps to the repo root (e.g. `import db from "@/lib/db"`).
- **Route handler `params` are async — you MUST `await params`:** `const { id } = await params;`
- Put **`"use client"`** at the top of any page/component using interactivity (`useState`, `useEffect`, `onClick`, forms).
- **Never put server code in a client component.** Data access stays in route handlers under `app/api/.../route.js`; the client page calls them with `fetch`.
- Route folders prefixed with `_` are private and won't be served — don't name routes that way.
- Keep it simple: sensible names, minimal UI, no new tools/frameworks without a real need. This is a 2-hour build, not production.

## Data & persistence

Storage is **local SQLite via `better-sqlite3`**, opened in `lib/db.js`, saved to `app.db` at the repo root. It's already whitelisted in `next.config.mjs` (`serverExternalPackages`) and is **server-only**. A starter `items` table exists (`id`, `title`, `created_at`) — rename, extend, or add tables. There is no pre-built example route; use the patterns below.

1. **Add a table** in `lib/db.js` with `db.exec(\`CREATE TABLE IF NOT EXISTS ...\`)` (safe to run every start; follow the existing style — autoincrement `id`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`).
2. **Create a route** at `app/api/<thing>/route.js` (and `app/api/<thing>/[id]/route.js` to edit/delete one).
3. **Call it from the page** with `fetch` — GET read, POST add, PUT edit, DELETE remove.

```js
// Read — app/api/things/route.js
import db from "@/lib/db";
export async function GET() {
  const rows = db.prepare("SELECT * FROM things ORDER BY id DESC").all();
  return Response.json(rows);
}
// Write — same file
export async function POST(request) {
  const { title } = await request.json();
  const info = db.prepare("INSERT INTO things (title) VALUES (?)").run(title);
  return Response.json({ id: info.lastInsertRowid });
}
```
```js
// Edit/delete one — app/api/things/[id]/route.js
export async function DELETE(request, { params }) {
  const { id } = await params;            // MUST await
  db.prepare("DELETE FROM things WHERE id = ?").run(id);
  return Response.json({ ok: true });
}
```

- Reads: `db.prepare(sql).all()` (many) / `.get()` (one). Writes: `db.prepare(sql).run(...)`.
- After wiring, tell the user only: *"Saved — it'll still be there next time you open the app."*

## Testing / verifying changes

Always confirm a change actually works before telling the user it's done:

- **Mandatory preview rule:** before you say anything is ready, run `npm run dev` if it is not already running, open the app preview, and give the user the clickable link: `Your app is open here: [link](http://localhost:3000)`.
- Load the page in the preview, exercise the new behavior (add/edit/delete), and confirm saved data comes back — a quick `curl` against the route works too.
- When preparing, reviewing, or checking this starter, run `npm run preflight` yourself. Do not ask the user or facilitator to run it unless the environment blocks you.
- After bigger changes, run `npm run preflight` yourself before saying the work is ready.
- Only then report success, in plain words.

## Troubleshooting (fix it yourself, never hand back errors)

When something's broken, you own it. Loop until it truly works, then report only the happy ending. Check these common traps first:

- Missing `"use client"` on an interactive page.
- Server/storage code imported into a client component.
- Didn't `await params` in a route handler.
- Route path doesn't match the `fetch` URL, or the folder is `_`-prefixed (private).
- SQL column/table mismatch, or the table wasn't created in `lib/db.js`.
- **A newly added page or route 404s → restart the dev server** (stop `npm run dev`, start it again). This is the most common one.

If the first fix doesn't hold, try another approach. Simplify if needed.

## Live challenge guardrails

- Keep the app small enough to finish in 2 hours: one main screen, clear actions, and only the saved information the idea truly needs.
- Avoid adding accounts, outside services, keys, uploads, complex permissions, or extra setup unless the user explicitly asks and it is essential.
- If the participant asks for a large idea, build the smallest useful version first, show it, then improve it.
- If anything feels stuck during the session, fix it without asking the participant to troubleshoot.

## Security considerations

- Always use `?` placeholders in SQL — never string-concatenate user input.
- Keep all data in the built-in local database. Never send the user to external/cloud services or ask for accounts or keys.
