import type { CanonicalResumeJson, ResumeResponseDto, ResumeVersionDto } from "../types/resume.dto";
import type { ResumeModel, ResumeVersionModel, ResumeJsonModel } from "../types/resume.model";

export class ResumeMapper {
  static toModel(resumeDto: ResumeResponseDto): ResumeModel {
    return resumeDto;
  }

  static toVersionModel(versionDto: ResumeVersionDto): ResumeVersionModel {
    return versionDto;
  }

  static toJsonModel(resumeJson: CanonicalResumeJson): ResumeJsonModel {
    return resumeJson;
  }
}

