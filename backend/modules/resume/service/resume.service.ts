import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma as sharedPrisma } from "../../../lib/prisma";
import { ResumeRepository, AdminResumeItem } from "../repository/resume.repository";
import { ResumeVersionService } from "./resume-version.service";
import { Resume } from "../domain/entities/resume.entity";
import { ResumeValidator } from "../validators/resume.validator";
import { CreateResumeDto } from "../dto/create-resume.dto";
import { UpdateResumeDto } from "../dto/update-resume.dto";
import { ResumeMapper } from "../mappers/resume.mapper";
import { ResumeCreatedEvent } from "../domain/domain-events/resume-created.event";
import { ResumeUpdatedEvent } from "../domain/domain-events/resume-updated.event";
import { ForbiddenError, UnauthorizedError } from "../domain/errors";
import { ResumePdfService } from "./resume-pdf.service";
import { ResumeVersionRepository } from "../repository/resume-version.repository";

export interface RequestContext {
  userId: string;
  tenantId: string;
  roles: string[];
}

export class ResumeService {
  private readonly resumeRepo: ResumeRepository;
  private readonly versionService: ResumeVersionService;
  private readonly versionRepo: ResumeVersionRepository;
  private readonly validator: ResumeValidator;
  private readonly pdfService: ResumePdfService;

  constructor(prismaClient?: PrismaClient) {
    const prisma = prismaClient ?? sharedPrisma;
    this.resumeRepo = new ResumeRepository(prisma);
    this.versionService = new ResumeVersionService(prisma);
    this.versionRepo = new ResumeVersionRepository(prisma);
    this.validator = new ResumeValidator();
    this.pdfService = new ResumePdfService();
  }

  private assertCanAccess(context: RequestContext, resume: Resume): void {
    if (resume.tenantId !== context.tenantId) {
      throw new UnauthorizedError("Tenant mismatch");
    }
    const isOwner = resume.userId === context.userId;
    const isAdmin = context.roles.includes("ADMIN");
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError("Access to resume denied");
    }
  }

  private assertCanMutate(context: RequestContext, resume: Resume): void {
    if (!context.roles.includes("STUDENT")) {
      throw new ForbiddenError("Access to resume denied");
    }
    this.assertCanAccess(context, resume);
  }

  async createResume(dto: CreateResumeDto, context: RequestContext) {
    console.log("[ResumeService.createResume] Starting:", { userId: context.userId, hasRoleStudent: context.roles.includes("STUDENT") });
    
    if (!context.roles.includes("STUDENT")) {
      console.error("[ResumeService.createResume] REJECTED: User is not STUDENT");
      throw new ForbiddenError("Access to resume denied");
    }

    console.log("[ResumeService.createResume] Validating schema...");
    this.validator.validateCanonicalSchema(dto.resumeJson);
    console.log("[ResumeService.createResume] Schema valid");

    const now = new Date();
    const resume = Resume.create({
      id: uuidv4(),
      userId: context.userId,
      tenantId: context.tenantId,
      title: dto.title,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log("[ResumeService.createResume] Created resume entity:", { id: resume.id, title: resume.title });

    await this.resumeRepo.create(resume);
    console.log("[ResumeService.createResume] Saved resume to DB");
    
    console.log("[ResumeService.createResume] Creating version...");
    const version = await this.versionService.createVersion(resume.id, dto.resumeJson);
    console.log("[ResumeService.createResume] Version created:", { versionId: version.id, versionNumber: version.versionNumber });

    const event = new ResumeCreatedEvent(resume.id, context.userId, context.tenantId);
    console.info("Resume created", { resumeId: event.resumeId, userId: event.userId, tenantId: event.tenantId });

    const response = ResumeMapper.toResponseDto(resume, version);
    console.log("[ResumeService.createResume] SUCCESS - Response ready");
    return response;
  }

  async updateResume(id: string, dto: UpdateResumeDto, context: RequestContext) {
    console.log("[ResumeService.updateResume] Starting:", { resumeId: id, userId: context.userId });
    
    const existing = await this.resumeRepo.findById(id);
    console.log("[ResumeService.updateResume] Found existing:", existing ? "YES" : "NO");
    
    if (!existing) {
      throw new ForbiddenError("Access to resume denied");
    }

    this.assertCanMutate(context, existing);
    this.validator.validateCanonicalSchema(dto.resumeJson);

    if (dto.title) {
      existing.rename(dto.title);
    }

    await this.resumeRepo.update(existing);
    console.log("[ResumeService.updateResume] Updated resume");
    
    const version = await this.versionService.createVersion(existing.id, dto.resumeJson);
    console.log("[ResumeService.updateResume] Created version:", version.versionNumber);

    const event = new ResumeUpdatedEvent(existing.id, context.userId, context.tenantId, version.versionNumber);
    console.info("Resume updated", {
      resumeId: event.resumeId,
      userId: event.userId,
      tenantId: event.tenantId,
      versionNumber: event.versionNumber,
    });

    const response = ResumeMapper.toResponseDto(existing, version);
    return response;
  }

  async getResume(id: string, context: RequestContext) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw new ForbiddenError("Access to resume denied");
    }

    this.assertCanAccess(context, resume);
    const latest = await this.versionRepo.getLatest(resume.id);
    return ResumeMapper.toResponseDto(resume, latest ?? undefined);
  }

  async listResumes(context: RequestContext) {
    const resumes = await this.resumeRepo.listByUser(context.userId, context.tenantId);
    const mapped = await Promise.all(
      resumes.map(async (resume) => {
        const latest = await this.versionRepo.getLatest(resume.id);
        return ResumeMapper.toResponseDto(resume, latest ?? undefined);
      })
    );
    return mapped;
  }

  // Admin method: list all resumes in tenant with user info
  async adminListAllResumes(context: RequestContext) {
    // Only ADMIN can access all resumes
    if (!context.roles.includes("ADMIN")) {
      throw new ForbiddenError("Only ADMIN can access all resumes");
    }

    const resumes = await this.resumeRepo.listAllByTenant(context.tenantId);
    const mapped = await Promise.all(
      resumes.map(async (resume) => {
        const latest = await this.versionRepo.getLatest(resume.id);
        return {
          id: resume.id,
          userId: resume.userId,
          userEmail: resume.userEmail,
          userName: resume.userName,
          title: resume.title,
          isActive: resume.isActive,
          createdAt: resume.createdAt.toISOString(),
          updatedAt: resume.updatedAt.toISOString(),
          latestVersion: latest
            ? {
                id: latest.id,
                versionNumber: latest.versionNumber,
                resumeJson: latest.resumeJson,
                createdAt: latest.createdAt.toISOString(),
              }
            : null,
        };
      })
    );
    return mapped;
  }

  async deleteResume(id: string, context: RequestContext) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw new ForbiddenError("Access to resume denied");
    }

    this.assertCanMutate(context, resume);
    resume.deactivate();
    await this.resumeRepo.update(resume);
    console.info("Resume updated", { resumeId: resume.id, isActive: resume.isActive });
  }

  async getResumeVersion(resumeId: string, versionId: string, context: RequestContext) {
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ForbiddenError("Access to resume denied");
    }

    this.assertCanAccess(context, resume);

    const version = await this.versionRepo.getById(resume.id, versionId);
    if (!version) {
      throw new ForbiddenError("Access to resume denied");
    }

    return {
      id: version.id,
      resumeId: version.resumeId,
      versionNumber: version.versionNumber,
      resumeJson: version.resumeJson,
      createdAt: version.createdAt,
    };
  }

  async generatePdf(id: string, context: RequestContext) {
    const resume = await this.resumeRepo.findById(id);
    if (!resume) {
      throw new ForbiddenError("Access to resume denied");
    }

    this.assertCanAccess(context, resume);

    const latest = await this.versionRepo.getLatest(resume.id);
    if (!latest) {
      throw new ForbiddenError("Access to resume denied");
    }

    const { html } = this.pdfService.renderPdf(latest);
    const pdfUrl = this.pdfService.getPdfUrl(resume.id, latest.versionNumber);
    const event = this.pdfService.emitPdfGeneratedEvent(resume.id, latest.versionNumber, resume.tenantId);

    console.info("Resume PDF generated", {
      resumeId: event.resumeId,
      versionNumber: event.versionNumber,
      pdfUrl: event.pdfUrl,
      tenantId: event.tenantId,
    });

    return {
      html,
      pdfUrl,
    };
  }
}

