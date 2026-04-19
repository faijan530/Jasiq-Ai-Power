import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma as sharedPrisma } from "../../../lib/prisma";
import { ResumeVersionRepository } from "../repository/resume-version.repository";
import { ResumeVersion } from "../domain/entities/resume-version.entity";
import { ResumeVersionNumber } from "../domain/value-objects/resume-version-number.vo";

export class ResumeVersionService {
  private readonly versionRepo: ResumeVersionRepository;

  constructor(prismaClient?: PrismaClient) {
    const prisma = prismaClient ?? sharedPrisma;
    this.versionRepo = new ResumeVersionRepository(prisma);
  }

  async createVersion(resumeId: string, resumeJson: any): Promise<ResumeVersion> {
    console.log("[ResumeVersionService.createVersion] Starting:", { resumeId, hasJson: !!resumeJson });
    
    try {
      const latest = await this.versionRepo.getLatest(resumeId);
      console.log("[ResumeVersionService.createVersion] Latest version:", latest);
      
      const nextVersionNumber = ResumeVersionNumber.create((latest?.versionNumber ?? 0) + 1);
      console.log("[ResumeVersionService.createVersion] Next version number:", nextVersionNumber.value);

      const version = ResumeVersion.create({
        id: uuidv4(),
        resumeId,
        versionNumber: nextVersionNumber.value,
        resumeJson,
        createdAt: new Date(),
      });

      console.log("[ResumeVersionService.createVersion] Created version entity:", { id: version.id, versionNumber: version.versionNumber });
      
      const saved = await this.versionRepo.create(version);
      console.log("[ResumeVersionService.createVersion] Saved to repository successfully");
      
      return saved;
    } catch (error) {
      console.error("[ResumeVersionService.createVersion] FAILED:", error);
      throw error;
    }
  }

  async getVersions(resumeId: string): Promise<ResumeVersion[]> {
    return this.versionRepo.getVersions(resumeId);
  }
}

