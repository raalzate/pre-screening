import { db, initDb } from '../lib/db';

async function verifyTransaction() {
    console.log("🔄 Initializing DB...");
    await initDb();

    const TEST_CODE = "TRANS-TEST-001";

    // 1. Setup: Ensure user exists in 'users' and not in 'history'
    console.log("SETUP: Creating test user...");
    await db.execute("DELETE FROM users WHERE code = ?", [TEST_CODE]);
    await db.execute("DELETE FROM history_candidates WHERE code = ?", [TEST_CODE]);

    await db.execute({
        sql: `INSERT INTO users (name, code, requirements, step, form_id) VALUES (?, ?, ?, ?, ?)`,
        args: ["Transaction Tester", TEST_CODE, "test-reqs", "interview", "test-form"]
    });

    // 2. Execute Transaction (Simulating API Logic)
    console.log("bw EXEC: Running migration transaction...");

    const feedback = "Verified via script";
    const status = "pasa";
    const technicalLevel = "Senior";
    const interviewerName = "ScriptBot";

    try {
        await db.batch([
            {
                sql: `
                INSERT INTO history_candidates (
                    name, email, code, requirements, step, form_id, 
                    evaluation_result, questions, certification_result, 
                    challenge_result, interview_feedback, interview_status, 
                    technical_level, interviewer_name
                ) 
                SELECT 
                    name, email, code, requirements, 'feedback', form_id, 
                    evaluation_result, questions, certification_result, 
                    challenge_result, ?, ?, ?, ?
                FROM users 
                WHERE code = ?
            `,
                args: [feedback, status, technicalLevel, interviewerName, TEST_CODE]
            },
            {
                sql: "DELETE FROM users WHERE code = ?",
                args: [TEST_CODE]
            }
        ], "write");
        console.log("✅ Transaction executed successfully.");
    } catch (e) {
        console.error("❌ Transaction failed:", e);
        process.exit(1);
    }

    // 3. Verification
    console.log("🔎 VERIFYING results...");

    const userCheck = await db.execute("SELECT * FROM users WHERE code = ?", [TEST_CODE]);
    const historyCheck = await db.execute("SELECT * FROM history_candidates WHERE code = ?", [TEST_CODE]);

    if (userCheck.rows.length === 0) {
        console.log("✅ User removed from 'users' table.");
    } else {
        console.error("❌ User STILL in 'users' table.");
    }

    if (historyCheck.rows.length === 1) {
        console.log("✅ User found in 'history_candidates' table.");
        const row = historyCheck.rows[0];
        if (row.interview_status === status && row.technical_level === technicalLevel) {
            console.log("✅ Data integrity verified (status/level match).");
        } else {
            console.error("❌ Data mismatch in history record.");
        }
        if (row.moved_at) {
            console.log(`✅ 'moved_at' timestamp present: ${row.moved_at}`);
        } else {
            console.error("❌ 'moved_at' timestamp missing.");
        }
    } else {
        console.error("❌ User NOT found in 'history_candidates' table.");
    }
}

verifyTransaction().catch(console.error);
