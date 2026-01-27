import { db, initDb } from '../lib/db';

async function setup() {
    await initDb();

    const code = "MIGRATE-001";
    console.log(`Setting up candidate ${code}...`);

    await db.execute({
        sql: `INSERT OR REPLACE INTO users (name, code, requirements, step, form_id) 
          VALUES (?, ?, ?, ?, ?)`,
        args: ["Test Migration", code, "pichincha-ssr:angular-frontend", "interview", "angular-frontend"]
    });

    console.log("✅ Candidate ready.");
}

setup().catch(console.error);
