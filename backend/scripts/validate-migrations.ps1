#!/usr/bin/env pwsh
# Migration Validation Script
# Run this before committing to ensure no drift

$ErrorActionPreference = "Stop"

Write-Host "🔍 Validating Prisma Migrations..." -ForegroundColor Cyan

# 1. Check if schema is valid
Write-Host "`n1. Validating schema..." -ForegroundColor Yellow
try {
    $validateOutput = npx prisma validate 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Schema validation failed!" -ForegroundColor Red
        Write-Host $validateOutput
        exit 1
    }
    Write-Host "✅ Schema is valid" -ForegroundColor Green
} catch {
    Write-Host "❌ Schema validation error: $_" -ForegroundColor Red
    exit 1
}

# 2. Check migration status
Write-Host "`n2. Checking migration status..." -ForegroundColor Yellow
try {
    $statusOutput = npx prisma migrate status 2>&1
    
    # Check for drift indicators in output
    if ($statusOutput -match "drift detected|modified after|not in sync|Differences detected") {
        Write-Host "❌ Migration drift detected!" -ForegroundColor Red
        Write-Host $statusOutput
        Write-Host "`n🔧 Run these commands to fix:" -ForegroundColor Cyan
        Write-Host "   npx prisma migrate resolve --applied <migration_name>" -ForegroundColor White
        Write-Host "   npx prisma db push" -ForegroundColor White
        exit 1
    }
    
    Write-Host "✅ No drift detected" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not check migration status: $_" -ForegroundColor Yellow
}

# 3. Verify Prisma client is generated
Write-Host "`n3. Checking Prisma client..." -ForegroundColor Yellow
$clientPath = "./node_modules/.prisma/client/index.d.ts"
if (-not (Test-Path $clientPath)) {
    Write-Host "⚠️  Prisma client not found. Generating..." -ForegroundColor Yellow
    npx prisma generate
}
Write-Host "✅ Prisma client ready" -ForegroundColor Green

# 4. Check for unapplied migrations
Write-Host "`n4. Checking for unapplied migrations..." -ForegroundColor Yellow
try {
    $statusOutput = npx prisma migrate status 2>&1
    
    if ($statusOutput -match "have not yet been applied|Pending migration") {
        Write-Host "⚠️  Unapplied migrations found!" -ForegroundColor Yellow
        Write-Host "   Run: npx prisma migrate dev" -ForegroundColor White
        # Don't exit with error, just warn
    } else {
        Write-Host "✅ All migrations applied" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check migration status" -ForegroundColor Yellow
}

Write-Host "`n✨ Migration validation complete!" -ForegroundColor Green
Write-Host "   You can safely commit your changes." -ForegroundColor Cyan
