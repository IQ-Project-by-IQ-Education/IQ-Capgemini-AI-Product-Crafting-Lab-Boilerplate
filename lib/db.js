// ─────────────────────────────────────────────────────────────────────────
// YOUR APP'S MEMORY (the database)
//
// Everything your app needs to remember is saved right here, inside this
// project, in a single file called "app.db". No accounts, no cloud, no setup.
// This file opens that storage and makes sure your tables exist.
//
// To remember a new kind of information, add a table below by copying the
// example. Each table is like a spreadsheet: columns are the fields, rows
// are the saved entries.
// ─────────────────────────────────────────────────────────────────────────

import { DatabaseSync } from "node:sqlite";

// Open (or create) the storage file at the root of the project.
const db = new DatabaseSync("app.db");

// Speeds up saving and reading. Safe to leave as-is.
db.exec("PRAGMA journal_mode = WAL");

// Run several writes as one all-or-nothing step, e.g. db.transaction(() => { ... })().
db.transaction = (fn) => (...args) => {
  db.exec("BEGIN");
  try {
    const result = fn(...args);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
};

// ── Example table ──────────────────────────────────────────────────────────
// A starter "items" table so storage works out of the box. Rename it, change
// the columns, or add more tables alongside it to fit whatever you're building.
//
//   id          a unique number for each entry (filled in automatically)
//   title       some text
//   created_at  when it was saved (filled in automatically)
//
// CREATE TABLE IF NOT EXISTS ...  means "make this table only if it's missing",
// so it's safe to run every time the app starts.
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    siret TEXT NOT NULL,
    office TEXT NOT NULL,
    timeline TEXT NOT NULL,
    price TEXT NOT NULL,
    references_text TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS experts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS expert_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expert_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    level_score INTEGER NOT NULL,
    FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS expert_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expert_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
  )
`);

const expertCount = db.prepare("SELECT COUNT(*) AS count FROM experts").get().count;

if (expertCount === 0) {
  const addExpert = db.prepare("INSERT INTO experts (name, email) VALUES (?, ?)");
  const addSkill = db.prepare(
    "INSERT INTO expert_skills (expert_id, name, level, level_score) VALUES (?, ?, ?, ?)"
  );
  const addProject = db.prepare(
    "INSERT INTO expert_projects (expert_id, name, description) VALUES (?, ?, ?)"
  );

  const seedExperts = [
    {
      name: "Amina Laurent",
      email: "amina.laurent@example.com",
      skills: [
        ["Cloud architecture", "Expert", 4],
        ["AWS", "Advanced", 3],
        ["Platform modernization", "Advanced", 3],
      ],
      projects: [
        ["Retail Cloud Move", "Led the move of core retail systems to a resilient cloud platform."],
        ["Data Platform Foundation", "Designed shared cloud patterns for analytics teams."],
      ],
    },
    {
      name: "Marcus Chen",
      email: "marcus.chen@example.com",
      skills: [
        ["Artificial intelligence", "Expert", 4],
        ["Machine learning", "Expert", 4],
        ["Python", "Advanced", 3],
      ],
      projects: [
        ["Service Desk AI", "Built an assistant to route employee questions and speed up support."],
        ["Forecast Studio", "Delivered prediction models for finance planning teams."],
      ],
    },
    {
      name: "Sofia Martin",
      email: "sofia.martin@example.com",
      skills: [
        ["Cybersecurity", "Expert", 4],
        ["Risk assessment", "Advanced", 3],
        ["Identity management", "Advanced", 3],
      ],
      projects: [
        ["Identity Renewal", "Managed access improvements across business applications."],
        ["Security Review Sprint", "Reviewed project risk and created action plans for leadership."],
      ],
    },
    {
      name: "Noah Dubois",
      email: "noah.dubois@example.com",
      skills: [
        ["Change management", "Expert", 4],
        ["Employee adoption", "Advanced", 3],
        ["Training", "Advanced", 3],
      ],
      projects: [
        ["ERP Adoption", "Prepared teams for a new finance and operations tool."],
        ["Digital Workplace Launch", "Ran communications and training for a collaboration rollout."],
      ],
    },
  ];

  const seed = db.transaction(() => {
    seedExperts.forEach((expert) => {
      const info = addExpert.run(expert.name, expert.email);
      expert.skills.forEach(([name, level, score]) => addSkill.run(info.lastInsertRowid, name, level, score));
      expert.projects.forEach(([name, description]) => addProject.run(info.lastInsertRowid, name, description));
    });
  });

  seed();
}

// Add more tables here as your app grows. For example:
//
// db.exec(`
//   CREATE TABLE IF NOT EXISTS tasks (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     done INTEGER DEFAULT 0,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP
//   )
// `);

export default db;
