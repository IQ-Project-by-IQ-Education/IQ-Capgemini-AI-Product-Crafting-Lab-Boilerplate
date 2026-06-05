// Opens the SQLite database file (app.db) on your computer.
// This code only runs on the server side of Next.js, which is allowed to touch files.
import Database from "better-sqlite3";

const db = new Database("app.db");

// Make sure the table exists (safe to run every time).
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
