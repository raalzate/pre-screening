#!/bin/bash

# Verification script for Candidate Self-Deletion feature
# Usage: bash scripts/verify-withdrawal.sh

echo "🔍 Starting verification of Candidate Self-Deletion feature..."

# 1. Check Database Helpers
echo "Checking lib/db.ts for new functions..."
grep -q "export async function withdrawCandidate" lib/db.ts && echo "✅ withdrawCandidate found" || echo "❌ withdrawCandidate MISSING"
grep -q "export async function createAdminNotification" lib/db.ts && echo "✅ createAdminNotification found" || echo "❌ createAdminNotification MISSING"

# 2. Check API Endpoints
echo "Checking for API endpoint files..."
[ -f "app/api/user/withdraw/route.ts" ] && echo "✅ Withdraw API found" || echo "❌ Withdraw API MISSING"
[ -f "app/api/admin/notifications/route.ts" ] && echo "✅ Notifications API found" || echo "❌ Notifications API MISSING"

# 3. Check UI Components
echo "Checking UI components for withdrawal logic..."
grep -q "handleWithdraw" app/\(protected\)/page.tsx && echo "✅ Candidate portal: handleWithdraw found" || echo "❌ Candidate portal: handleWithdraw MISSING"
grep -q "AdminNotification" components/AdminHeader.tsx && echo "✅ Admin header: Notification logic found" || echo "❌ Admin header: Notification logic MISSING"

# 4. Check Database Table (Optional: Requires Turso/LibSQL CLI or Node script)
echo "Checking database table 'admin_notifications' structure..."
npx ts-node -e "
import { initDb, db } from './lib/db';
async function run() {
  await initDb();
  try {
    const tableInfo = await db.execute(\"PRAGMA table_info(admin_notifications)\");
    if (tableInfo.rows.length > 0) {
      console.log('✅ admin_notifications table exists in database');
    } else {
      console.log('❌ admin_notifications table MISSING in database');
    }
  } catch (e) {
    console.error('❌ Error checking database:', e);
  }
}
run();
"

echo "🎯 Verification complete."
