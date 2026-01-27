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
  const usersTableSchema = `
    name TEXT NOT NULL,
    email TEXT NULL,
    code TEXT PRIMARY KEY,
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

  await db.execute(`CREATE TABLE IF NOT EXISTS users (${usersTableSchema});`);
  await db.execute(`CREATE TABLE IF NOT EXISTS history_candidates (
    ${usersTableSchema},
    moved_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);

  // Asegurar que las columnas existan en bases de datos ya creadas
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
          console.error(`Error al añadir columna ${col.name} a la tabla ${table}:`, e);
        }
      }
    }
  }
}
