import { PrismaClient } from "@prisma/client";
import { AtsReport, AtsReportProps } from "../domain/entities/ats-report.entity";
import { AtsScore } from "../domain/value-objects/ats-score.vo";
import { KeywordMatch } from "../domain/value-objects/keyword-match.vo";

export class AtsReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(report: AtsReport): Promise<AtsReport> {
    const data = report.toJSON();

    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO ats_reports (
          id, resume_id, version_id, tenant_id, 
          overall_score, section_scores, keyword_matches, 
          issues, suggestions, created_at, updated_at
        ) VALUES ($1::uuid, $2::uuid, $3::uuid, $4::uuid, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10, $11)`,
        data.id,
        data.resumeId,
        data.versionId,
        data.tenantId,
        data.overallScore,
        JSON.stringify(data.sectionScores),
        JSON.stringify(data.keywordMatches),
        JSON.stringify(data.issues),
        JSON.stringify(data.suggestions),
        data.createdAt,
        data.updatedAt
      );
      return report;
    } catch (error) {
      console.error("[AtsReportRepository.create] Failed to insert ATS report:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<AtsReport | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id,
        overall_score, section_scores, keyword_matches,
        issues, suggestions, created_at, updated_at
       FROM ats_reports
       WHERE id = $1::uuid`,
      id
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return this.mapRowToEntity(rows[0]);
  }

  async findByVersionId(versionId: string): Promise<AtsReport | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id,
        overall_score, section_scores, keyword_matches,
        issues, suggestions, created_at, updated_at
       FROM ats_reports
       WHERE version_id = $1::uuid
       ORDER BY created_at DESC
       LIMIT 1`,
      versionId
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return this.mapRowToEntity(rows[0]);
  }

  async findByResumeId(resumeId: string): Promise<AtsReport[]> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id,
        overall_score, section_scores, keyword_matches,
        issues, suggestions, created_at, updated_at
       FROM ats_reports
       WHERE resume_id = $1::uuid
       ORDER BY created_at DESC`,
      resumeId
    );

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async existsForVersion(versionId: string): Promise<boolean> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 1 FROM ats_reports WHERE version_id = $1::uuid LIMIT 1`,
      versionId
    );
    return rows.length > 0;
  }

  private mapRowToEntity(row: any): AtsReport {
    const sectionScores = typeof row.section_scores === "string" 
      ? JSON.parse(row.section_scores) 
      : row.section_scores;

    const keywordMatches = (typeof row.keyword_matches === "string"
      ? JSON.parse(row.keyword_matches)
      : row.keyword_matches || []).map((km: any) =>
      KeywordMatch.create(km.keyword, km.found, km.category, km.context)
    );

    const issues = typeof row.issues === "string" 
      ? JSON.parse(row.issues) 
      : row.issues || [];

    const suggestions = typeof row.suggestions === "string"
      ? JSON.parse(row.suggestions)
      : row.suggestions || [];

    const props: AtsReportProps = {
      id: row.id,
      resumeId: row.resume_id,
      versionId: row.version_id,
      tenantId: row.tenant_id,
      score: AtsScore.create(sectionScores),
      keywordMatches,
      issues,
      suggestions,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return AtsReport.reconstitute(props);
  }
}
