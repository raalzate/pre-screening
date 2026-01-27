// lib/db.ts
import { createClient } from '@libsql/client';
import { config } from './config';

const url = config.TURSO_DB_URL;
const authToken = config.TURSO_DB_TOKEN || "";

export const db = createClient({
  url: url,
  authToken: authToken,
});

// Inicialización de tablas (solo si no existen)
export async function initDb() {
  const commonColumns = `
    name TEXT NOT NULL,
    email TEXT NULL,
    code TEXT NOT NULL,
    requirements TEXT NOT NULL,
    step TEXT NOT NULL,
    form_id TEXT NOT NULL,
    evaluation_result TEXT NULL,
    questions TEXT NULL,
    certification_result TEXT NULL,
    challenge_result TEXT NULL,
    interview_feedback TEXT NULL,
    interview_status TEXT NULL,
    technical_level TEXT NULL,
    interviewer_name TEXT NULL
  `;

  const usersTableSchema = `
    ${commonColumns},
    PRIMARY KEY (code, requirements)
  `;

  const historySchema = `
    ${commonColumns},
    moved_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (code, requirements, moved_at)
  `;

  // Migration Check: Inspect if 'users' uses composite key
  let needsMigration = false;
  try {
    const tableInfo = await db.execute("PRAGMA table_info(users)");
    const codeCol = tableInfo.rows.find(row => row.name === 'code');
    const reqCol = tableInfo.rows.find(row => row.name === 'requirements');

    const tableExists = tableInfo.rows.length > 0;
    if (tableExists) {
      if (codeCol && codeCol.pk === 1 && reqCol && reqCol.pk === 0) {
        needsMigration = true;
      }
    }
  } catch (e) {
    console.error("Error inspecting table:", e);
  }

  if (needsMigration) {
    console.log("Migrating 'users' table to composite primary key...");
    await db.batch([
      "ALTER TABLE users RENAME TO users_old",
      `CREATE TABLE users (${usersTableSchema})`,
      "INSERT INTO users SELECT * FROM users_old",
      "DROP TABLE users_old"
    ], "write");
    console.log("Migration complete.");
  } else {
    await db.execute(`CREATE TABLE IF NOT EXISTS users (${usersTableSchema});`);
  }

  // History table migration check
  let historyNeedsMigration = false;
  try {
    const tableInfo = await db.execute("PRAGMA table_info(history_candidates)");
    const codeCol = tableInfo.rows.find(row => row.name === 'code');
    const reqCol = tableInfo.rows.find(row => row.name === 'requirements');

    if (tableInfo.rows.length > 0) {
      if (codeCol && codeCol.pk === 1 && reqCol && reqCol.pk === 0) {
        historyNeedsMigration = true;
      }
    }
  } catch (e) {
    console.error("Error inspecting history table:", e);
  }

  if (historyNeedsMigration) {
    console.log("Migrating 'history_candidates' table...");
    await db.batch([
      "ALTER TABLE history_candidates RENAME TO history_old",
      `CREATE TABLE history_candidates (${historySchema})`,
      "INSERT INTO history_candidates SELECT * FROM history_old",
      "DROP TABLE history_old"
    ], "write");
    console.log("History migration complete.");
  } else {
    await db.execute(`CREATE TABLE IF NOT EXISTS history_candidates (${historySchema});`);
  }

  // Asegurar que las columnas existan en bases de datos ya creadas (Idempotent column add)
  const optionalColumns = [
    { name: "email", type: "TEXT NULL" },
    { name: "interview_feedback", type: "TEXT NULL" },
    { name: "interview_status", type: "TEXT NULL" },
    { name: "technical_level", type: "TEXT NULL" },
    { name: "interviewer_name", type: "TEXT NULL" }
  ];

  const tables = ["users", "history_candidates"];

  for (const table of tables) {
    for (const col of optionalColumns) {
      try {
        await db.execute(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type};`);
      } catch (e: any) {
        if (!e.message?.includes("duplicate column name") && !e.message?.includes("already exists")) {
          // ignore column exists error
        }
      }
    }
  }
}
