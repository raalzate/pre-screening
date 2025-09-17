import Database from 'better-sqlite3';

const db = new Database('users.db');

// Crea la tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    name TEXT NOT NULL,
    code TEXT PRIMARY KEY,
    requirements TEXT NOT NULL,
    step TEXT NOT NULL,
    form_id TEXT NOT NULL,
    evaluation_result TEXT NULL,
    questions TEXT NULL,
    certification_result TEXT  NULL,
    challenge_result TEXT  NULL
  );
`).run();

export default db;