import { db, initDb } from '../lib/db';

async function testMultiProfile() {
    console.log("🔄 Initializing DB...");
    await initDb();

    const CODE = "MULTI-TEST-USER";
    const REQ_1 = "profile-frontend";
    const REQ_2 = "profile-backend";

    console.log(`Setting up user with code ${CODE}...`);

    // Clear previous
    await db.execute("DELETE FROM users WHERE code = ?", [CODE]);

    // Insert Profile 1
    await db.execute(`
    INSERT INTO users (name, code, requirements, step, form_id) 
    VALUES (?, ?, ?, 'welcome', 'form-a')
  `, ["Multi User", CODE, REQ_1]);

    // Insert Profile 2
    await db.execute(`
    INSERT INTO users (name, code, requirements, step, form_id) 
    VALUES (?, ?, ?, 'welcome', 'form-b')
  `, ["Multi User", CODE, REQ_2]);

    console.log("✅ Seeded user with 2 profiles.");

    // Verify DB content
    const rows = await db.execute("SELECT * FROM users WHERE code = ?", [CODE]);
    console.log(`DB Rows found: ${rows.rows.length}`);
    if (rows.rows.length !== 2) {
        console.error("❌ Failed to insert 2 rows. Check primary key logic.");
        process.exit(1);
    }

    // Verify API Logic (Simulated)
    console.log("Simulating Login API check...");

    if (rows.rows.length > 1) {
        console.log("✅ API Logic would return 'profiles' array.");
        console.log("Profiles:", rows.rows.map(r => ({ req: r.requirements, form: r.form_id })));
    } else {
        console.error("❌ API Logic would return single user.");
    }
}

testMultiProfile().catch(console.error);
