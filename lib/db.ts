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
    interviewer_name TEXT NULL,
    certification_started_at TEXT NULL
  `;

  const usersTableSchema = `
    ${commonColumns},
    PRIMARY KEY (code, requirements, form_id)
  `;

  const historySchema = `
    ${commonColumns},
    moved_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (code, requirements, form_id, moved_at)
  `;

  // Migration Check: Inspect if 'users' uses composite key
  let needsMigration = false;
  try {
    const tableInfo = await db.execute("PRAGMA table_info(users)");
    const codeCol = tableInfo.rows.find(row => row.name === 'code');
    const reqCol = tableInfo.rows.find(row => row.name === 'requirements');

    const tableExists = tableInfo.rows.length > 0;
    if (tableExists) {
      const formCol = tableInfo.rows.find(row => row.name === 'form_id');
      if (codeCol && codeCol.pk === 1 && reqCol && reqCol.pk === 2 && formCol && formCol.pk === 0) {
        needsMigration = true;
      }
    }
  } catch (e) {
    console.error("Error inspecting table:", e);
  }

  const coreColumns = "name, email, code, requirements, step, form_id, evaluation_result, questions, certification_result, challenge_result, certification_started_at";

  if (needsMigration) {
    console.log("Migrating 'users' table to composite primary key...");
    await db.batch([
      "ALTER TABLE users RENAME TO users_old",
      `CREATE TABLE users (${usersTableSchema})`,
      `INSERT INTO users (${coreColumns}) SELECT ${coreColumns} FROM users_old`,
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
      const formCol = tableInfo.rows.find(row => row.name === 'form_id');
      if (codeCol && codeCol.pk === 1 && reqCol && reqCol.pk === 2 && formCol && formCol.pk === 0) {
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
      `INSERT INTO history_candidates (${coreColumns}) SELECT ${coreColumns} FROM history_old`,
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
    { name: "interviewer_name", type: "TEXT NULL" },
    { name: "certification_started_at", type: "TEXT NULL" },
    { name: "reminder_count", type: "INTEGER DEFAULT 0" },
    { name: "last_reminder_at", type: "TEXT NULL" },
    { name: "retry_count", type: "INTEGER DEFAULT 0" },
    { name: "created_by", type: "TEXT NULL" },
    { name: "job_description", type: "TEXT NULL" },
    { name: "source_url", type: "TEXT NULL" }
  ];

  const tables = ["users", "history_candidates", "studio_requirements"];

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

  // Form analyses table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS form_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id TEXT NOT NULL,
      analysis_text TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_possible INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Studio Requirements table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS studio_requirements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT NULL,
      job_description TEXT NULL,
      source_url TEXT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Studio Forms table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS studio_forms (
      id TEXT PRIMARY KEY,
      requirement_id TEXT REFERENCES studio_requirements(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // AI Rate Limits table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ai_rate_limits (
      user_id TEXT PRIMARY KEY,
      request_count INTEGER DEFAULT 0,
      window_start TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Helper functions for Admin Notifications
export async function createAdminNotification(data: {
  type: string;
  candidateName?: string;
  candidateCode?: string;
  message: string;
}) {
  return await db.execute({
    sql: `
      INSERT INTO admin_notifications (type, candidate_name, candidate_code, message)
      VALUES (?, ?, ?, ?)
    `,
    args: [data.type, data.candidateName || null, data.candidateCode || null, data.message]
  });
}

export async function getUnreadAdminNotifications() {
  const result = await db.execute("SELECT * FROM admin_notifications WHERE is_read = 0 ORDER BY created_at DESC");
  return result.rows;
}

export async function markNotificationAsRead(id: number) {
  return await db.execute({
    sql: "UPDATE admin_notifications SET is_read = 1 WHERE id = ?",
    args: [id]
  });
}

// Helper functions for Form Analysis
export async function saveFormAnalysis(data: {
  formId: string;
  analysisText: string;
  score: number;
  totalPossible: number;
  percentage: number;
}) {
  return await db.execute({
    sql: `
      INSERT INTO form_analyses (form_id, analysis_text, score, total_possible, percentage)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [data.formId, data.analysisText, data.score, data.totalPossible, data.percentage]
  });
}

export async function getFormAnalysesByFormId(formId: string) {
  const result = await db.execute({
    sql: "SELECT * FROM form_analyses WHERE form_id = ? ORDER BY created_at DESC",
    args: [formId]
  });
  return result.rows;
}

export async function getHistoryCandidates() {
  const result = await db.execute("SELECT * FROM history_candidates ORDER BY moved_at DESC");
  return result.rows;
}

export async function restoreCandidate(code: string, requirements: string, formId: string) {
  const columns = "name, email, code, requirements, step, form_id, evaluation_result, questions, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name, created_by, certification_started_at";

  return await db.batch([
    {
      sql: `INSERT INTO users (${columns}) SELECT ${columns} FROM history_candidates WHERE code = ? AND requirements = ? AND form_id = ?`,
      args: [code, requirements, formId]
    },
    {
      sql: "DELETE FROM history_candidates WHERE code = ? AND requirements = ? AND form_id = ?",
      args: [code, requirements, formId]
    }
  ], "write");
}

export async function withdrawCandidate(code: string, requirements: string, formId: string) {
  const columns = "name, email, code, requirements, step, form_id, evaluation_result, questions, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name, created_by, certification_started_at";

  return await db.batch([
    {
      sql: `INSERT INTO history_candidates (${columns}, moved_at)
            SELECT name, email, code, requirements, 'feedback', form_id, evaluation_result, questions, certification_result, challenge_result, interview_feedback, 'withdrawn', technical_level, interviewer_name, created_by, certification_started_at, CURRENT_TIMESTAMP
            FROM users WHERE code = ? AND requirements = ? AND form_id = ?`,
      args: [code, requirements, formId]
    },
    {
      sql: "DELETE FROM users WHERE code = ? AND requirements = ? AND form_id = ?",
      args: [code, requirements, formId]
    }
  ], "write");
}
export async function deleteCandidatePermanently(code: string, requirements: string, formId: string) {
  return await db.batch([
    {
      sql: "DELETE FROM users WHERE code = ? AND requirements = ? AND form_id = ?",
      args: [code, requirements, formId]
    },
    {
      sql: "DELETE FROM history_candidates WHERE code = ? AND requirements = ? AND form_id = ?",
      args: [code, requirements, formId]
    }
  ], "write");
}

// Helper functions for Studio Designer
export async function saveStudioRequirement(data: {
  id: string;
  title: string;
  content: string;
  metadata?: string;
  job_description?: string;
  source_url?: string;
}) {
  return await db.execute({
    sql: `INSERT OR REPLACE INTO studio_requirements (id, title, content, metadata, job_description, source_url) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.title, data.content, data.metadata || null, data.job_description || null, data.source_url || null]
  });
}

export async function getStudioRequirements() {
  const result = await db.execute("SELECT * FROM studio_requirements ORDER BY created_at DESC");
  return result.rows;
}

export async function getStudioRequirementById(id: string) {
  const result = await db.execute({
    sql: "SELECT * FROM studio_requirements WHERE id = ?",
    args: [id]
  });
  return result.rows[0];
}

export async function saveStudioForm(data: {
  id: string;
  requirement_id: string;
  title: string;
  content: string;
  metadata?: string;
}) {
  return await db.execute({
    sql: `INSERT OR REPLACE INTO studio_forms (id, requirement_id, title, content, metadata) VALUES (?, ?, ?, ?, ?)`,
    args: [data.id, data.requirement_id, data.title, data.content, data.metadata || null]
  });
}

export async function getStudioForms() {
  const result = await db.execute("SELECT * FROM studio_forms ORDER BY created_at DESC");
  return result.rows;
}

export async function getStudioFormById(id: string) {
  const result = await db.execute({
    sql: "SELECT * FROM studio_forms WHERE id = ?",
    args: [id]
  });
  return result.rows[0];
}

// AI Rate Limiting Helpers
export async function getAIRateLimit(userId: string) {
  const result = await db.execute({
    sql: "SELECT request_count, window_start FROM ai_rate_limits WHERE user_id = ?",
    args: [userId]
  });
  return result.rows[0];
}

export async function upsertAIRateLimit(userId: string, count: number, windowStart: string) {
  return await db.execute({
    sql: `INSERT OR REPLACE INTO ai_rate_limits (user_id, request_count, window_start)
          VALUES (?, ?, ?)`,
    args: [userId, count, windowStart]
  });
}

export async function incrementAIRateLimit(userId: string) {
  return await db.execute({
    sql: "UPDATE ai_rate_limits SET request_count = request_count + 1 WHERE user_id = ?",
    args: [userId]
  });
}
