import { PrismaClient } from "@prisma/client";
import { ResumeVersion } from "../domain/entities/resume-version.entity";

export class ResumeVersionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(version: ResumeVersion): Promise<ResumeVersion> {
    const data = version.toJSON();
    console.log("[ResumeVersionRepository.create] Inserting version:", { 
      id: data.id, 
      resumeId: data.resumeId, 
      versionNumber: data.versionNumber,
      jsonSize: JSON.stringify(data.resumeJson).length 
    });

    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO resume_versions (id, resume_id, version_number, resume_json, created_at)
         VALUES ($1, $2, $3, $4::jsonb, $5)`,
        data.id,
        data.resumeId,
        data.versionNumber,
        JSON.stringify(data.resumeJson),
        data.createdAt
      );
      console.log("[ResumeVersionRepository.create] Insert successful");
      return version;
    } catch (error) {
      console.error("[ResumeVersionRepository.create] Insert FAILED:", error);
      throw error;
    }
  }

  async getVersions(resumeId: string): Promise<ResumeVersion[]> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, resume_id, version_number, resume_json, created_at
       FROM resume_versions
       WHERE resume_id = $1
       ORDER BY version_number DESC`,
      resumeId
    );

    return rows.map((record) =>
      ResumeVersion.create({
        id: record.id,
        resumeId: record.resume_id,
        versionNumber: record.version_number,
        resumeJson: record.resume_json,
        createdAt: record.created_at,
      })
    );
  }

  async getLatest(resumeId: string): Promise<ResumeVersion | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, resume_id, version_number, resume_json, created_at
       FROM resume_versions
       WHERE resume_id = $1
       ORDER BY version_number DESC
       LIMIT 1`,
      resumeId
    );

    const record = rows[0];
    if (!record) {
      return null;
    }

    return ResumeVersion.create({
      id: record.id,
      resumeId: record.resume_id,
      versionNumber: record.version_number,
      resumeJson: record.resume_json,
      createdAt: record.created_at,
    });
  }

  async getById(resumeId: string, versionId: string): Promise<ResumeVersion | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, resume_id, version_number, resume_json, created_at
       FROM resume_versions
       WHERE resume_id = $1 AND id = $2
       LIMIT 1`,
      resumeId,
      versionId
    );

    const record = rows[0];
    if (!record) {
      return null;
    }

    return ResumeVersion.create({
      id: record.id,
      resumeId: record.resume_id,
      versionNumber: record.version_number,
      resumeJson: record.resume_json,
      createdAt: record.created_at,
    });
  }
}

