/**
 * Bootstrap Admin User Script
 * 
 * Creates a default admin user if one doesn't exist.
 * Run this script once after database setup.
 * 
 * Usage: npx ts-node scripts/bootstrap-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Default admin credentials - CHANGE THESE IN PRODUCTION!
const DEFAULT_ADMIN = {
  email: "admin@jasiq.com",
  password: "admin123",
  name: "System Administrator",
  role: "ADMIN" as const,
  tenantId: "11111111-1111-1111-1111-111111111111",
};

async function bootstrapAdmin() {
  console.log("🔧 JASIQ Admin Bootstrap");
  console.log("========================\n");

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.$queryRawUnsafe(
      `SELECT id, email FROM users WHERE role = 'ADMIN' AND is_active = true LIMIT 1`
    ) as any[];

    if (existingAdmin && existingAdmin.length > 0) {
      console.log("✅ Admin user already exists:");
      console.log(`   Email: ${existingAdmin[0].email}`);
      console.log(`   ID: ${existingAdmin[0].id}`);
      console.log("\n⚠️  If you need to create a new admin, delete the existing one first or use the admin panel.");
      return;
    }

    // Check if default admin email already exists (but not as ADMIN role)
    const existingEmail = await prisma.$queryRawUnsafe(
      `SELECT id, role FROM users WHERE email = $1 AND is_active = true LIMIT 1`,
      DEFAULT_ADMIN.email
    ) as any[];

    if (existingEmail && existingEmail.length > 0) {
      console.log(`❌ Email "${DEFAULT_ADMIN.email}" already exists with role: ${existingEmail[0].role}`);
      console.log("   Please use a different admin email or delete this user first.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    // Create admin user using raw query to bypass any middleware
    const result = await prisma.$queryRawUnsafe(
      `INSERT INTO users (
        id, email, password, name, role, tenant_id, is_active, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4::"UserRole", $5::uuid, true, NOW(), NOW()
      ) RETURNING id, email, name, role, created_at`,
      DEFAULT_ADMIN.email,
      hashedPassword,
      DEFAULT_ADMIN.name,
      DEFAULT_ADMIN.role,
      DEFAULT_ADMIN.tenantId
    ) as any[];

    const admin = result[0];

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Login Credentials:");
    console.log("   Email:    admin@jasiq.com");
    console.log("   Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
    console.log("\n👤 User Details:");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`   Created: ${admin.created_at}`);

  } catch (error) {
    console.error("\n❌ Failed to create admin user:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  bootstrapAdmin();
}

export { bootstrapAdmin, DEFAULT_ADMIN };
