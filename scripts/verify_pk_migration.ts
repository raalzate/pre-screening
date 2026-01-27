import { db, initDb } from '../lib/db';

async function verifyMigration() {
    console.log("🔄 Initializing DB (Migration Check)...");
    await initDb();

    console.log("✅ Initialization complete. Checking table info...");

    const tables = ["users", "history_candidates"];

    for (const table of tables) {
        console.log(`\nTable: ${table}`);
        const res = await db.execute(`PRAGMA table_info(${table})`);

        const codeCol = res.rows.find(r => r.name === 'code');
        const reqCol = res.rows.find(r => r.name === 'requirements');

        if (codeCol && reqCol) {
            console.log(`  code.pk: ${codeCol.pk}`);
            console.log(`  requirements.pk: ${reqCol.pk}`);

            if (Number(codeCol.pk) > 0 && Number(reqCol.pk) > 0) {
                console.log(`✅ ${table} has composite primary key.`);
            } else {
                console.error(`❌ ${table} does NOT have composite primary key! PK indices are: code=${codeCol.pk}, req=${reqCol.pk}`);
            }
        } else {
            console.error(`❌ ${table} missing columns code or requirements.`);
        }
    }
}

verifyMigration().catch(console.error);
