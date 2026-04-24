import { JdMatchReport } from "../domain/entities/jd-match-report.entity";
import { JdMatchReportResponseDto } from "../dto/jd-match-response.dto";

export class JdMatchMapper {
  static toResponseDto(report: JdMatchReport): JdMatchReportResponseDto {
    const json = report.toJSON();

    return {
      matchReportId: json.id,
      overallMatch: json.overallMatch,
      skillsMatch: json.skillsMatch,
      keywordMatch: json.keywordMatch,
      experienceMatch: json.experienceMatch,
      roleFitScore: json.roleFitScore,
      suggestions: json.suggestions,
    };
  }
}
