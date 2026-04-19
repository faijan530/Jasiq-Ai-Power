import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma as sharedPrisma } from "../../../lib/prisma";
import { AtsReportRepository } from "../repository/ats-report.repository";
import { ResumeRepository } from "../../resume/repository/resume.repository";
import { ResumeVersionRepository } from "../../resume/repository/resume-version.repository";
import { AtsNormalizerService } from "./ats-normalizer.service";
import { AtsRuleEngineService } from "./ats-rule-engine.service";
import { AtsAiFeedbackService, AtsAiFeedbackConfig } from "./ats-ai-feedback.service";
import { AtsInputValidator } from "../validators/ats-input.validator";
import { AtsMapper } from "../mappers/ats.mapper";
import { EvaluateAtsDto } from "../dto/evaluate-ats.dto";
import { AtsReportResponseDto } from "../dto/ats-response.dto";
import { AtsReport } from "../domain/entities/ats-report.entity";
import { AtsEvaluatedEvent } from "../domain/events/ats-evaluated.event";
import {
  AtsValidationError,
  AtsNotFoundError,
  AtsTenantMismatchError,
  AtsForbiddenError,
} from "../domain/errors";

export interface RequestContext {
  userId: string;
  tenantId: string;
  roles: string[];
}

export class AtsService {
  private readonly atsReportRepo: AtsReportRepository;
  private readonly resumeRepo: ResumeRepository;
  private readonly versionRepo: ResumeVersionRepository;
  private readonly normalizer: AtsNormalizerService;
  private readonly ruleEngine: AtsRuleEngineService;
  private readonly aiFeedback: AtsAiFeedbackService;
  private readonly validator: AtsInputValidator;

  constructor(
    prismaClient?: PrismaClient,
    aiFeedbackConfig?: AtsAiFeedbackConfig
  ) {
    const prisma = prismaClient ?? sharedPrisma;
    this.atsReportRepo = new AtsReportRepository(prisma);
    this.resumeRepo = new ResumeRepository(prisma);
    this.versionRepo = new ResumeVersionRepository(prisma);
    this.normalizer = new AtsNormalizerService();
    this.ruleEngine = new AtsRuleEngineService();
    this.aiFeedback = new AtsAiFeedbackService(aiFeedbackConfig);
    this.validator = new AtsInputValidator();
  }

  private assertCanEvaluate(context: RequestContext): void {
    if (!context.roles.includes("STUDENT")) {
      throw new AtsForbiddenError("Only STUDENT role can evaluate ATS");
    }
  }

  private assertCanView(context: RequestContext): void {
    if (!context.roles.includes("STUDENT") && !context.roles.includes("ADMIN")) {
      throw new AtsForbiddenError("Access denied");
    }
  }

  async evaluateAts(dto: EvaluateAtsDto, context: RequestContext): Promise<AtsReportResponseDto> {
    console.log("[AtsService.evaluateAts] Starting:", { resumeId: dto.resumeId, versionId: dto.versionId });

    try {
      this.assertCanEvaluate(context);
      this.validator.validateEvaluateDto(dto);

      const resume = await this.resumeRepo.findById(dto.resumeId);
      if (!resume) {
        console.error("[AtsService.evaluateAts] Resume not found:", dto.resumeId);
        throw new AtsNotFoundError("Resume not found");
      }

      if (resume.tenantId !== context.tenantId) {
        console.error("[AtsService.evaluateAts] Tenant mismatch for resume:", {
          resumeTenantId: resume.tenantId,
          contextTenantId: context.tenantId,
        });
        throw new AtsTenantMismatchError("Tenant mismatch");
      }

      const version = await this.versionRepo.getById(dto.resumeId, dto.versionId);
      if (!version) {
        console.error("[AtsService.evaluateAts] Version not found:", dto.versionId);
        throw new AtsNotFoundError("Resume version not found");
      }

      const existingReport = await this.atsReportRepo.findByVersionId(dto.versionId);
      if (existingReport) {
        console.log("[AtsService.evaluateAts] Returning existing ATS report:", existingReport.id);
        return AtsMapper.toResponseDto(existingReport);
      }

      console.log("[AtsService.evaluateAts] Normalizing resume...");
      const normalizedResume = this.normalizer.normalize(version);

      console.log("[AtsService.evaluateAts] Running rule engine...");
      const ruleResult = this.ruleEngine.evaluate(normalizedResume);

      console.log("[AtsService.evaluateAts] Generating AI feedback...");
      const suggestions = await this.aiFeedback.generateFeedback(
        normalizedResume,
        ruleResult.sectionScores,
        ruleResult.keywordMatches,
        ruleResult.issues
      );

      console.log("[AtsService.evaluateAts] Creating ATS report entity...");
      const atsReport = AtsReport.create(
        uuidv4(),
        dto.resumeId,
        dto.versionId,
        context.tenantId,
        ruleResult.sectionScores,
        ruleResult.keywordMatches,
        ruleResult.issues,
        suggestions
      );

      console.log("[AtsService.evaluateAts] Saving ATS report to database...");
      await this.atsReportRepo.create(atsReport);

      const event = new AtsEvaluatedEvent(
        atsReport.id,
        atsReport.resumeId,
        atsReport.versionId,
        atsReport.tenantId,
        atsReport.score.overall
      );
      console.info("ATS evaluation completed", {
        atsReportId: event.atsReportId,
        resumeId: event.resumeId,
        versionId: event.versionId,
        overallScore: event.overallScore,
        tenantId: event.tenantId,
      });

      const response = AtsMapper.toResponseDto(atsReport);
      console.log("[AtsService.evaluateAts] SUCCESS - Response ready");
      return response;
    } catch (error) {
      console.error("[AtsService.evaluateAts] FAILED:", {
        error: error instanceof Error ? error.message : String(error),
        resumeId: dto.resumeId,
        versionId: dto.versionId,
      });
      throw error;
    }
  }

  async getAtsReportByVersionId(
    versionId: string,
    context: RequestContext
  ): Promise<AtsReportResponseDto> {
    console.log("[AtsService.getAtsReportByVersionId] Starting:", { versionId });

    try {
      this.assertCanView(context);
      this.validator.validateVersionId(versionId);

      const atsReport = await this.atsReportRepo.findByVersionId(versionId);
      if (!atsReport) {
        console.error("[AtsService.getAtsReportByVersionId] ATS report not found:", versionId);
        throw new AtsNotFoundError("ATS report not found for this version");
      }

      if (atsReport.tenantId !== context.tenantId) {
        console.error("[AtsService.getAtsReportByVersionId] Tenant mismatch:", {
          reportTenantId: atsReport.tenantId,
          contextTenantId: context.tenantId,
        });
        throw new AtsTenantMismatchError("Tenant mismatch");
      }

      const response = AtsMapper.toResponseDto(atsReport);
      console.log("[AtsService.getAtsReportByVersionId] SUCCESS");
      return response;
    } catch (error) {
      console.error("[AtsService.getAtsReportByVersionId] FAILED:", {
        error: error instanceof Error ? error.message : String(error),
        versionId,
      });
      throw error;
    }
  }
}
