import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function diagnose() {
  console.log('=== Database Diagnostics ===\n');

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful\n');

    // Check resumes table
    const resumeCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM resumes`;
    console.log(`📊 Total resumes: ${resumeCount[0].count}`);

    // Check resume_versions table
    const versionCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM resume_versions`;
    console.log(`📊 Total versions: ${versionCount[0].count}\n`);

    // List all resumes
    if (resumeCount[0].count > 0) {
      const resumes = await prisma.$queryRaw`
        SELECT r.id, r.title, r.user_id, r.tenant_id, r.is_active, r.created_at,
               COUNT(v.id) as version_count
        FROM resumes r
        LEFT JOIN resume_versions v ON r.id = v.resume_id
        GROUP BY r.id
        ORDER BY r.created_at DESC
      `;
      
      console.log('📋 Existing Resumes:');
      resumes.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.title} (ID: ${r.id})`);
        console.log(`     User: ${r.user_id}`);
        console.log(`     Tenant: ${r.tenant_id}`);
        console.log(`     Active: ${r.is_active}, Versions: ${r.version_count}`);
        console.log(`     Created: ${r.created_at}\n`);
      });
    } else {
      console.log('⚠️ No resumes found in database\n');
    }

    // Test insert
    console.log('🧪 Testing INSERT operation...');
    const testId = 'test-' + Date.now();
    try {
      await prisma.$executeRaw`
        INSERT INTO resumes (id, user_id, tenant_id, title, is_active, created_at, updated_at)
        VALUES (${testId}, '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Test Resume', true, NOW(), NOW())
      `;
      console.log('✅ INSERT successful');
      
      // Clean up test data
      await prisma.$executeRaw`DELETE FROM resumes WHERE id = ${testId}`;
      console.log('✅ Test data cleaned up\n');
    } catch (err) {
      console.error('❌ INSERT failed:', err.message);
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nCheck your DATABASE_URL in .env file');
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
