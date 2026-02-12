#!/bin/bash

# Simple verification script for Candidate Reminder System

echo "Checking database columns..."
# Assuming we can use sqlite3 to check the local users.db if it exists, 
# or just checking the schema configuration in the code.
grep -q "reminder_count" lib/db.ts
if [ $? -eq 0 ]; then
  echo "✓ Found reminder_count in db.ts"
else
  echo "✗ reminder_count NOT found in db.ts"
fi

grep -q "last_reminder_at" lib/db.ts
if [ $? -eq 0 ]; then
  echo "✓ Found last_reminder_at in db.ts"
else
  echo "✗ last_reminder_at NOT found in db.ts"
fi

echo "Checking API endpoints..."
if [ -f "app/api/admin/reminders/route.ts" ]; then
  echo "✓ Found /api/admin/reminders"
else
  echo "✗ /api/admin/reminders NOT found"
fi

if [ -f "app/api/admin/candidates/[code]/route.ts" ]; then
  echo "✓ Found /api/admin/candidates/[code]"
else
  echo "✗ /api/admin/candidates/[code] NOT found"
fi

echo "Checking UI components..."
grep -q "setIsDeleteModalOpen" app/\(public\)/admin/page.tsx
if [ $? -eq 0 ]; then
  echo "✓ Found deletion modal logic in page.tsx"
else
  echo "✗ deletion modal logic NOT found in page.tsx"
fi

echo "Verification complete."
