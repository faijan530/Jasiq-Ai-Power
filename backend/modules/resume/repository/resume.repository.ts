import { PrismaClient } from "@prisma/client";
import { Resume } from "../domain/entities/resume.entity";

export class ResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(resume: Resume): Promise<Resume> {
    const data = resume.toJSON();
    console.log("[ResumeRepository.create] Attempting to create resume:", { id: data.id, title: data.title, userId: data.userId });

    try {
      const result = await this.prisma.$executeRawUnsafe(
        `INSERT INTO resumes (id, user_id, tenant_id, title, is_active, created_at, updated_at)
         VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6, $7)`,
        data.id,
        data.userId,
        data.tenantId,
        data.title,
        data.isActive,
        data.createdAt,
        data.updatedAt
      );
      console.log("[ResumeRepository.create] Insert result (rows affected):", result);
      return resume;
    } catch (error) {
      console.error("[ResumeRepository.create] Failed to insert resume:", error);
      throw error;
    }
  }

  async update(resume: Resume): Promise<Resume> {
    const data = resume.toJSON();
    console.log("[ResumeRepository.update] Attempting to update resume:", { id: data.id, title: data.title });

    try {
      const result = await this.prisma.$executeRawUnsafe(
        `UPDATE resumes
         SET title = $1,
             is_active = $2,
             updated_at = $3
         WHERE id = $4::uuid`,
        data.title,
        data.isActive,
        data.updatedAt,
        data.id
      );
      console.log("[ResumeRepository.update] Update result (rows affected):", result);
      return resume;
    } catch (error) {
      console.error("[ResumeRepository.update] Failed to update resume:", error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 1 FROM resumes WHERE id = $1::uuid LIMIT 1`,
      id
    );
    return rows.length > 0;
  }

  async findById(id: string): Promise<Resume | null> {
    const row: any = await this.prisma.$queryRawUnsafe(
      `SELECT id, user_id, tenant_id, title, is_active, created_at, updated_at
       FROM resumes
       WHERE id = $1::uuid`,
      id
    );

    const record = Array.isArray(row) ? row[0] : row;
    if (!record) {
      return null;
    }

    return Resume.create({
      id: record.id,
      userId: record.user_id,
      tenantId: record.tenant_id,
      title: record.title,
      isActive: record.is_active,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  async listByUser(userId: string, tenantId: string): Promise<Resume[]> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, user_id, tenant_id, title, is_active, created_at, updated_at
       FROM resumes
       WHERE user_id = $1::uuid AND tenant_id = $2::uuid AND is_active = true
       ORDER BY created_at DESC`,
      userId,
      tenantId
    );

    return rows.map(
      (record) =>
        Resume.create({
          id: record.id,
          userId: record.user_id,
          tenantId: record.tenant_id,
          title: record.title,
          isActive: record.is_active,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        })
    );
  }

  // Admin method: list all active resumes in tenant with user info
  async listAllByTenant(tenantId: string): Promise<AdminResumeItem[]> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT r.id, r.user_id, r.tenant_id, r.title, r.is_active, r.created_at, r.updated_at,
              u.email as user_email, u.name as user_name
       FROM resumes r
       JOIN users u ON r.user_id = u.id
       WHERE r.tenant_id = $1::uuid AND r.is_active = true AND u.is_active = true
       ORDER BY r.created_at DESC`,
      tenantId
    );

    return rows.map(
      (record) => ({
        id: record.id,
        userId: record.user_id,
        tenantId: record.tenant_id,
        title: record.title,
        isActive: record.is_active,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        userEmail: record.user_email,
        userName: record.user_name,
      })
    );
  }
}

// Admin resume item type - plain object with user info
export interface AdminResumeItem {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userEmail?: string;
  userName?: string;
}

