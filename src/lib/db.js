import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "campus-hub.db");

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','professor','org')),
  school_domain TEXT NOT NULL,
  major TEXT,
  minor TEXT,
  class_year INTEGER,
  department TEXT,
  interests TEXT,
  org_name TEXT,
  org_category TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  school_domain TEXT NOT NULL,
  title TEXT NOT NULL,
  majors TEXT,
  minors TEXT,
  entry_credit TEXT,
  path_type TEXT NOT NULL,
  class_year INTEGER,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK(visibility IN ('public','anonymous','school_only')),
  summary TEXT,
  terms_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plan_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  school_domain TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  target_majors TEXT,
  level TEXT NOT NULL,
  event_date TEXT,
  deadline TEXT,
  apply_link TEXT,
  apply_instructions TEXT,
  contact TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  school_domain TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('item','sublet')),
  title TEXT NOT NULL,
  category TEXT,
  price TEXT,
  condition TEXT,
  description TEXT,
  pickup_area TEXT,
  date_range TEXT,
  room_type TEXT,
  amenities TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listing_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`;

function initDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const database = new DatabaseSync(DB_PATH);
  database.exec("PRAGMA journal_mode = WAL;");
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec(SCHEMA_SQL);
  return database;
}

// Cache the connection on globalThis so Next.js dev-mode module reloads
// don't open a fresh SQLite handle on every request.
const globalForDb = globalThis;

export default function getDb() {
  if (!globalForDb.__campusHubDb) {
    globalForDb.__campusHubDb = initDb();
  }
  return globalForDb.__campusHubDb;
}
