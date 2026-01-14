// lib/db.ts
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DB_URL || "file:local.db";
const authToken = process.env.TURSO_DB_TOKEN || "";

export const db = createClient({
  url: url,
  authToken: authToken,
});

// Inicialización de tabla (solo si no existe)
export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
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
    );
  `);

  // Asegurar que las columnas existan en bases de datos ya creadas
  const columns = [
    { name: "email", type: "TEXT NULL" },
    { name: "interview_feedback", type: "TEXT NULL" },
    { name: "interview_status", type: "TEXT NULL" },
    { name: "technical_level", type: "TEXT NULL" },
    { name: "interviewer_name", type: "TEXT NULL" }
  ];

  for (const col of columns) {
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
    } catch (e: any) {
      if (!e.message?.includes("duplicate column name") && !e.message?.includes("already exists")) {
        console.error(`Error al añadir columna ${col.name}:`, e);
      }
    }
  }
}
