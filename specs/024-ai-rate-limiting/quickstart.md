# Quickstart: AI Rate Limiting

## Installation

1. **Database Migration**: Run the migration script to create the `ai_rate_limits` table.
   ```bash
   # (TBD: script command or manual SQL in lib/db.ts)
   ```

2. **Integration**: The rate limiting is automatically applied via the `BaseGenerator` class. No changes are needed to individual generator subclasses.

## Configuration

The defaults are defined in `lib/ia/rateLimiter.ts`:
- **Requests**: 5
- **Window**: 60 seconds

## Verification

To test the rate limit:
1. Authenticate as an admin.
2. Quickly trigger the "Generate Benchmark" action 6 times.
3. Observe the 6th request returning a `429` error with the user-friendly message.
