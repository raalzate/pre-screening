// lib/db.ts
import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_TOKEN!,
});

// Inicialización de tabla (solo si no existe)
export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT NOT NULL,
      code TEXT PRIMARY KEY,
      requirements TEXT NOT NULL,
      step TEXT NOT NULL,
      form_id TEXT NOT NULL,
      evaluation_result TEXT NULL,
      questions TEXT NULL,
      certification_result TEXT NULL,
      challenge_result TEXT NULL
    );
  `);
}
