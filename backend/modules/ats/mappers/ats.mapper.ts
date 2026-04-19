import { AtsReport } from "../domain/entities/ats-report.entity";
import { AtsReportResponseDto } from "../dto/ats-response.dto";

export class AtsMapper {
  static toResponseDto(report: AtsReport): AtsReportResponseDto {
    const json = report.toJSON();

    return {
      atsReportId: json.id,
      overallScore: json.overallScore,
      sectionScores: json.sectionScores,
      keywordMatches: json.keywordMatches,
      issues: json.issues,
      suggestions: json.suggestions,
    };
  }
}
