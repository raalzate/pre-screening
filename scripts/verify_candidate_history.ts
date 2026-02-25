
// This script needs env vars set before execution
import { initDb, db, getHistoryCandidates, restoreCandidate } from '../lib/db';

async function verify() {
    console.log("Starting verification...");

    try {
        await initDb();
        const testCode = "RESTORE_TEST_" + Date.now();
        const testReq = "test-req";

        console.log(`Creating test candidate in history: ${testCode}`);

        await db.execute({
            sql: `INSERT INTO history_candidates (name, email, code, requirements, step, form_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            args: ["Test User", "test@example.com", testCode, testReq, "feedback", "test-form"]
        });

        console.log("Checking history list...");
        const history = await getHistoryCandidates();
        const found = history.find(h => h.code === testCode);
        if (!found) throw new Error("Candidate not found in history");
        console.log("✅ Candidate found in history");

        console.log("Restoring candidate...");
        await restoreCandidate(testCode, testReq, "test-form");

        console.log("Verifying restoration...");
        const active = await db.execute({
            sql: "SELECT * FROM users WHERE code = ?",
            args: [testCode]
        });

        if (active.rows.length === 0) throw new Error("Candidate not found in active list after restoration");
        console.log("✅ Candidate restored to active list");

        const historyAfter = await db.execute({
            sql: "SELECT * FROM history_candidates WHERE code = ?",
            args: [testCode]
        });

        if (historyAfter.rows.length > 0) throw new Error("Candidate still exists in history after restoration");
        console.log("✅ Candidate removed from history");

        // Cleanup
        await db.execute({ sql: "DELETE FROM users WHERE code = ?", args: [testCode] });
        console.log("✅ Cleanup complete");
        console.log("Verification SUCCESSFUL");

    } catch (error) {
        console.error("❌ Verification FAILED:", error);
        process.exit(1);
    }
}

verify();
