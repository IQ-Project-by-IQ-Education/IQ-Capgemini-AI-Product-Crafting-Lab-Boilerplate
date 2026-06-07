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

import Database from "better-sqlite3";

// Open (or create) the storage file at the root of the project.
const db = new Database("app.db");

// Speeds up saving and reading. Safe to leave as-is.
db.pragma("journal_mode = WAL");

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
