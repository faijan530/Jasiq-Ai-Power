import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma as sharedPrisma } from "../../../lib/prisma";
import { JdMatchReportRepository } from "../repository/jd-match-report.repository";
import { ResumeRepository } from "../../resume/repository/resume.repository";
import { ResumeVersionRepository } from "../../resume/repository/resume-version.repository";
import { JdNormalizerService } from "./jd-normalizer.service";
import { JdRuleEngineService } from "./jd-rule-engine.service";
import { JdAiFeedbackService, JdAiFeedbackConfig } from "./jd-ai-feedback.service";
import { JdInputValidator } from "../validators/jd-input.validator";
import { JdMatchMapper } from "../mappers/jd-match.mapper";
import { EvaluateMatchDto } from "../dto/evaluate-match.dto";
import { JdMatchReportResponseDto } from "../dto/jd-match-response.dto";
import { JdMatchReport, JdMatchSuggestion } from "../domain/entities/jd-match-report.entity";
import { MatchScoreSections } from "../domain/value-objects/match-score.vo";
import { KeywordAnalysis } from "../domain/value-objects/keyword-analysis.vo";
import { JdMatchedEvent } from "../domain/domain-events/jd-matched.event";
import {
  JdValidationError,
  JdNotFoundError,
  JdTenantMismatchError,
  JdForbiddenError,
} from "../domain/errors";

export interface RequestContext {
  userId: string;
  tenantId: string;
  roles: string[];
}

export class JdMatchService {
  private readonly jdMatchRepo: JdMatchReportRepository;
  private readonly resumeRepo: ResumeRepository;
  private readonly versionRepo: ResumeVersionRepository;
  private readonly normalizer: JdNormalizerService;
  private readonly ruleEngine: JdRuleEngineService;
  private readonly aiFeedback: JdAiFeedbackService;
  private readonly validator: JdInputValidator;

  constructor(
    prismaClient?: PrismaClient,
    aiFeedbackConfig?: JdAiFeedbackConfig
  ) {
    const prisma = prismaClient ?? sharedPrisma;
    this.jdMatchRepo = new JdMatchReportRepository(prisma);
    this.resumeRepo = new ResumeRepository(prisma);
    this.versionRepo = new ResumeVersionRepository(prisma);
    this.normalizer = new JdNormalizerService();
    this.ruleEngine = new JdRuleEngineService();
    this.aiFeedback = new JdAiFeedbackService(aiFeedbackConfig);
    this.validator = new JdInputValidator();
  }

  async evaluateMatch(
    dto: EvaluateMatchDto,
    context: RequestContext
  ): Promise<{ report: JdMatchReport; event: JdMatchedEvent }> {
    // 1. Validate DTO
    this.validator.validateEvaluateDto(dto);

    // 2. RBAC check - only STUDENT can evaluate
    if (!context.roles.includes("STUDENT")) {
      throw new JdForbiddenError("Only STUDENT role can evaluate job descriptions");
    }

    // 3. Fetch resume and verify ownership
    const resume = await this.resumeRepo.findById(dto.resumeId);
    if (!resume) {
      throw new JdNotFoundError(`Resume not found: ${dto.resumeId}`);
    }

    // 4. Tenant isolation check
    if (resume.tenantId !== context.tenantId) {
      throw new JdTenantMismatchError("Tenant mismatch in JD match evaluation");
    }

    // 5. Fetch version
    const version = await this.versionRepo.findById(dto.versionId);
    if (!version) {
      throw new JdNotFoundError(`Resume version not found: ${dto.versionId}`);
    }

    // 6. Verify version belongs to resume
    if (version.resumeId !== dto.resumeId) {
      throw new JdValidationError("Version does not belong to the specified resume");
    }

    console.log("[JdMatchService] Starting JD match evaluation", {
      resumeId: dto.resumeId,
      versionId: dto.versionId,
    });

    // 7. Normalize JD
    const normalizedJd = this.normalizer.normalize(dto.jobDescription);

    // 8. Extract resume skills
    const resumeSkills = this.normalizer.extractResumeSkills(version.resumeJson);

    // 9. Run rule engine
    const matchResult = this.ruleEngine.evaluate(
      version.resumeJson,
      normalizedJd,
      resumeSkills
    );

    // 10. Generate AI suggestions
    const aiResult = await this.aiFeedback.generateSuggestions(
      version.resumeJson,
      normalizedJd,
      matchResult.skillsMatch
    );

    // 11. Build section scores
    const sectionScores: MatchScoreSections = {
      skills: matchResult.skillsMatch.score,
      experience: matchResult.experienceMatch.score,
      keywords: matchResult.keywordMatch.score,
      roleFit: matchResult.roleFit.score,
    };

    // 12. Build keyword analysis matches
    const keywordMatches = normalizedJd.extractedKeywords.map((keyword) => ({
      keyword,
      found: matchResult.keywordMatch.found.includes(keyword),
      importance: "required" as const,
    }));

    // 13. Create match report entity
    const reportId = uuidv4();
    const report = JdMatchReport.create(
      reportId,
      dto.resumeId,
      dto.versionId,
      context.tenantId,
      normalizedJd.jobTitle,
      dto.jobDescription,
      sectionScores,
      matchResult.skillsMatch,
      KeywordAnalysis.create(keywordMatches),
      matchResult.experienceMatch,
      aiResult.suggestions
    );

    // 14. Persist report
    await this.jdMatchRepo.create(report);

    // 15. Create domain event
    const event = new JdMatchedEvent(
      reportId,
      dto.resumeId,
      dto.versionId,
      context.tenantId,
      matchResult.overallMatch,
      normalizedJd.jobTitle
    );

    console.log("[JdMatchService] JD match evaluation completed", {
      reportId,
      overallMatch: matchResult.overallMatch,
    });

    return { report, event };
  }

  async getReportByVersionId(
    versionId: string,
    context: RequestContext
  ): Promise<JdMatchReportResponseDto> {
    // Validate versionId
    this.validator.validateVersionId(versionId);

    // Fetch report
    const report = await this.jdMatchRepo.findByVersionId(versionId);
    if (!report) {
      throw new JdNotFoundError(`JD match report not found for version: ${versionId}`);
    }

    // Tenant check
    if (report.tenantId !== context.tenantId) {
      throw new JdTenantMismatchError("Tenant mismatch when accessing JD match report");
    }

    // RBAC check - STUDENT and ADMIN can view
    if (!context.roles.includes("STUDENT") && !context.roles.includes("ADMIN")) {
      throw new JdForbiddenError("Not allowed to view JD match reports");
    }

    return JdMatchMapper.toResponseDto(report);
  }

  async getReportsByResumeId(
    resumeId: string,
    context: RequestContext
  ): Promise<JdMatchReportResponseDto[]> {
    // Verify resume exists and belongs to tenant
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new JdNotFoundError(`Resume not found: ${resumeId}`);
    }

    if (resume.tenantId !== context.tenantId) {
      throw new JdTenantMismatchError("Tenant mismatch when accessing JD match reports");
    }

    // RBAC check
    if (!context.roles.includes("STUDENT") && !context.roles.includes("ADMIN")) {
      throw new JdForbiddenError("Not allowed to view JD match reports");
    }

    const reports = await this.jdMatchRepo.findByResumeId(resumeId);
    return reports.map((r) => JdMatchMapper.toResponseDto(r));
  }
}
