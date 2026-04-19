import { Resume } from "../domain/entities/resume.entity";
import { ResumeVersion } from "../domain/entities/resume-version.entity";
import { ResumeResponseDto } from "../dto/resume-response.dto";

export class ResumeMapper {
  static toResponseDto(resume: Resume, latestVersion?: ResumeVersion): ResumeResponseDto {
    return {
      id: resume.id,
      userId: resume.userId,
      tenantId: resume.tenantId,
      title: resume.title,
      isActive: resume.isActive,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
      latestVersion:
        latestVersion &&
        ({
          id: latestVersion.id,
          versionNumber: latestVersion.versionNumber,
          resumeJson: latestVersion.resumeJson,
          createdAt: latestVersion.createdAt.toISOString(),
        } as any),
    };
  }
}

