# Research: Transactional Candidate Migration

## Unknowns & Investigations

### How to perform atomic "Move" operations in Turso (libsql)?
- **Investigation**: Since Turso is based on SQLite, a "move" is typically an `INSERT INTO ... SELECT FROM ...` followed by a `DELETE`.
- **Finding**: The `@libsql/client` library provides a `batch()` method that executes multiple statements in a single transaction. This ensures that either both the insert and delete succeed, or neither does.
- **Decision**: Use `db.batch([stmt1, stmt2], "write")` for the migration.

### Handling Schema Evolution
- **Investigation**: If the `users` table gains new columns, the `history_candidates` table must also be updated.
- **Finding**: It is best to maintain both tables in the `initDb()` function in `lib/db.ts`.
- **Decision**: Update `initDb()` to ensure both tables have identical data columns.

## Decisions

### Decision: Batch Transaction
- **Rationale**: Guarantees atomicity. A candidate won't be deleted if the history insertion fails, preventing data loss.
- **Alternatives considered**: 
    - Sequential `execute` calls: Risk of orphaned state if the second call fails.
    - SQL Triggers: Harder to maintain in a Next.js environment where logic is often application-level.

### Decision: Extended History Table
- **Rationale**: Adding a `moved_at` column allows for auditing when the candidate completed the process.
- **Rationale**: Keeping all other columns identical to `users` simplifies the `SELECT *` migration logic.
