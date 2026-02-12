#!/bin/bash

# Security Verification Script for Certification (T013)

BASE_URL=${1:-"http://localhost:3000"}
echo "🔍 Verifying security for $BASE_URL ..."

# We'd need a valid session token to truly test via curl if auth is enabled.
# For now, we'll verify the presence of the security logic in the source code.

echo "Checking app/api/certification/route.ts for data stripping..."
if grep -q "correctAnswer" "app/api/certification/route.ts" && grep -q "rationale" "app/api/certification/route.ts"; then
    echo "✅ Found references to correctAnswer/rationale in API route (likely for stripping/logic)."
else
    echo "❌ Could not find answer-related logic in API route."
fi

echo "Checking lib/ia/certification.ts for server-side validation..."
if [ -f "lib/ia/certification.ts" ]; then
    echo "✅ Utility file exists."
else
    echo "❌ Utility file missing."
fi

echo "Checking DynamicMCQForm.tsx for removed local validation..."
if grep -q "details.push" "components/DynamicMCQForm.tsx"; then
    echo "⚠️ Warning: 'details.push' found in DynamicMCQForm. Verify it's not performing local validation."
else
    echo "✅ Local validation logic appears removed from DynamicMCQForm."
fi

echo "Verification complete."
