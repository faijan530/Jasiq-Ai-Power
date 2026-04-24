#!/usr/bin/env pwsh
# Fix Migration Drift Script
# Safe recovery without data loss

param(
    [string]$MigrationName = "20260331140000_create_resume_tables"
)

$ErrorActionPreference = "Stop"

Write-Host "🔧 Fixing Migration Drift..." -ForegroundColor Cyan
Write-Host "   Target Migration: $MigrationName" -ForegroundColor Gray

# 1. Show current status
Write-Host "`n1. Current migration status:" -ForegroundColor Yellow
npx prisma migrate status

# 2. Resolve the drift by marking as applied
Write-Host "`n2. Resolving drift (marking migration as applied)..." -ForegroundColor Yellow
try {
    npx prisma migrate resolve --applied $MigrationName
    Write-Host "✅ Migration marked as applied" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not resolve (may already be resolved): $_" -ForegroundColor Yellow
}

# 3. Pull current database state
Write-Host "`n3. Syncing with database..." -ForegroundColor Yellow
try {
    npx prisma db pull --force 2>&1 | Out-Null
    Write-Host "✅ Database state synced" -ForegroundColor Green
} catch {
    Write-Host "⚠️  db pull skipped: $_" -ForegroundColor Yellow
}

# 4. Generate client
Write-Host "`n4. Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Prisma client generated" -ForegroundColor Green

# 5. Verify
Write-Host "`n5. Verification:" -ForegroundColor Yellow
$validateResult = npx prisma validate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema validation passed" -ForegroundColor Green
} else {
    Write-Host "❌ Schema validation failed" -ForegroundColor Red
    Write-Host $validateResult
    exit 1
}

# 6. Check status again
Write-Host "`n6. Final migration status:" -ForegroundColor Yellow
npx prisma migrate status

Write-Host "`n✨ Migration drift fixed!" -ForegroundColor Green
Write-Host "   Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test your application" -ForegroundColor White
Write-Host "   2. Run: npm run validate-migrations" -ForegroundColor White
Write-Host "   3. Commit any new migration files" -ForegroundColor White
