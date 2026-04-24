import { PrismaClient } from "@prisma/client";
import { JdMatchReport, JdMatchReportProps } from "../domain/entities/jd-match-report.entity";
import { MatchScore } from "../domain/value-objects/match-score.vo";
import { KeywordAnalysis } from "../domain/value-objects/keyword-analysis.vo";

export class JdMatchReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(report: JdMatchReport): Promise<JdMatchReport> {
    const data = report.toJSON();

    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO jd_match_reports (
          id, resume_id, version_id, tenant_id, job_title, jd_text,
          overall_match, skills_match, keyword_match, experience_match,
          role_fit_score, suggestions, created_at, updated_at
        ) VALUES ($1::uuid, $2::uuid, $3::uuid, $4::uuid, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12::jsonb, $13, $14)`,
        data.id,
        data.resumeId,
        data.versionId,
        data.tenantId,
        data.jobTitle,
        data.jdText,
        data.overallMatch,
        JSON.stringify(data.skillsMatch),
        JSON.stringify(data.keywordMatch),
        JSON.stringify(data.experienceMatch),
        data.roleFitScore,
        JSON.stringify(data.suggestions),
        data.createdAt,
        data.updatedAt
      );
      return report;
    } catch (error) {
      console.error("[JdMatchReportRepository.create] Failed to insert JD match report:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<JdMatchReport | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id, job_title, jd_text,
        overall_match, skills_match, keyword_match, experience_match,
        role_fit_score, suggestions, created_at, updated_at
       FROM jd_match_reports
       WHERE id = $1::uuid`,
      id
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return this.mapRowToEntity(rows[0]);
  }

  async findByVersionId(versionId: string): Promise<JdMatchReport | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id, job_title, jd_text,
        overall_match, skills_match, keyword_match, experience_match,
        role_fit_score, suggestions, created_at, updated_at
       FROM jd_match_reports
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

  async findByResumeId(resumeId: string): Promise<JdMatchReport[]> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        id, resume_id, version_id, tenant_id, job_title, jd_text,
        overall_match, skills_match, keyword_match, experience_match,
        role_fit_score, suggestions, created_at, updated_at
       FROM jd_match_reports
       WHERE resume_id = $1::uuid
       ORDER BY created_at DESC`,
      resumeId
    );

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async existsForVersion(versionId: string): Promise<boolean> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 1 FROM jd_match_reports WHERE version_id = $1::uuid LIMIT 1`,
      versionId
    );
    return rows.length > 0;
  }

  private mapRowToEntity(row: any): JdMatchReport {
    const skillsMatch = typeof row.skills_match === "string" 
      ? JSON.parse(row.skills_match) 
      : row.skills_match;

    const keywordMatch = typeof row.keyword_match === "string"
      ? JSON.parse(row.keyword_match)
      : row.keyword_match;

    const experienceMatch = typeof row.experience_match === "string"
      ? JSON.parse(row.experience_match)
      : row.experience_match;

    const suggestions = typeof row.suggestions === "string"
      ? JSON.parse(row.suggestions)
      : row.suggestions || [];

    const sectionScores = {
      skills: skillsMatch?.score || 0,
      experience: experienceMatch?.score || 0,
      keywords: keywordMatch?.matchPercentage ? Math.round((keywordMatch.matchPercentage / 100) * 20) : 0,
      roleFit: row.role_fit_score || 0,
    };

    const props: JdMatchReportProps = {
      id: row.id,
      resumeId: row.resume_id,
      versionId: row.version_id,
      tenantId: row.tenant_id,
      jobTitle: row.job_title,
      jdText: row.jd_text,
      score: MatchScore.create(sectionScores),
      skillsMatch,
      keywordAnalysis: KeywordAnalysis.create(keywordMatch?.matches || []),
      experienceMatch,
      suggestions,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return JdMatchReport.reconstitute(props);
  }
}
