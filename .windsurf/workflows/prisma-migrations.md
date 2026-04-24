---
description: Prisma Migration Workflow - Prevent Drift
tags: [prisma, database, migration, backend]
---

# Prisma Migration Workflow

## ⚠️ CRITICAL RULES

### 1. NEVER Modify Applied Migrations
- Once a migration is applied to the database, DO NOT edit its SQL file
- If you need changes, create a NEW migration

### 2. Always Use Prisma Generate First
```bash
npx prisma generate
```

### 3. Schema-First Approach
1. Edit `prisma/schema.prisma` FIRST
2. Run `npx prisma migrate dev --name <name>`
3. NEVER manually edit generated migration SQL

### 4. Check Migration Status Before Any Operation
```bash
npx prisma migrate status
```

## 🔧 Fixing Drift (If It Happens)

### Option A: Safe Resolution (No Data Loss)
```bash
# 1. Mark current migration as applied (if drift detected)
npx prisma migrate resolve --applied <migration_name>

# 2. For new tables, use raw SQL then introspect
cat > new_table.sql << 'EOF'
CREATE TABLE IF NOT EXISTS "new_table" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);
EOF

npx prisma db execute --file=new_table.sql
npx prisma db pull
npx prisma generate
```

### Option B: Reset (Data Loss - Dev Only)
```bash
npx prisma migrate reset
```

## 📝 Adding New Tables (JD Match Example)

### Step 1: Add Model to Schema
```prisma
model NewTable {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  
  @@map("new_table")
}
```

### Step 2: Create Migration
```bash
npx prisma migrate dev --name add_new_table
```

### Step 3: Generate Client
```bash
npx prisma generate
```

## 🚨 Preventing Drift Checklist

Before committing migrations:

- [ ] Schema and migration SQL are in sync
- [ ] `npx prisma validate` passes
- [ ] `npx prisma migrate status` shows no drift
- [ ] Foreign keys use correct types (UUID)
- [ ] Timestamps use `@db.Timestamptz(6)`
- [ ] Ran `npx prisma generate` after migration

## 🔄 Daily Workflow

```bash
# 1. Check status
npx prisma migrate status

# 2. If drift detected, resolve before making changes
# 3. Make schema changes
# 4. Create migration
npx prisma migrate dev --name descriptive_name

# 5. Generate client
npx prisma generate

# 6. Verify
npx prisma validate
```

## 📁 Project-Specific Notes

### Neon PostgreSQL
- Uses `gen_random_uuid()` for UUID generation
- All UUID fields must use `@db.Uuid` in schema
- Timestamps must use `@db.Timestamptz(6)`

### Existing Tables
- `resumes`: Core resume storage
- `resume_versions`: Version history with JSON
- `ats_reports`: ATS analysis results
- `jd_match_reports`: JD match results

### Relationships
- `resume_versions.resume_id` → `resumes.id` (CASCADE delete)
- `ats_reports.version_id` → `resume_versions.id` (CASCADE delete)
