import { EvaluateMatchDto } from "../dto/evaluate-match.dto";
import { JdValidationError } from "../domain/errors";

export class JdInputValidator {
  validateEvaluateDto(dto: EvaluateMatchDto): void {
    if (!dto) {
      throw new JdValidationError("Request body is required");
    }

    if (!dto.resumeId || typeof dto.resumeId !== "string") {
      throw new JdValidationError("resumeId is required and must be a string");
    }

    if (!dto.versionId || typeof dto.versionId !== "string") {
      throw new JdValidationError("versionId is required and must be a string");
    }

    if (!dto.jobDescription || typeof dto.jobDescription !== "string") {
      throw new JdValidationError("jobDescription is required and must be a string");
    }

    const wordCount = dto.jobDescription.trim().split(/\s+/).length;
    if (wordCount < 50) {
      throw new JdValidationError(`Job description must have at least 50 words (found ${wordCount})`);
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(dto.resumeId)) {
      throw new JdValidationError("resumeId must be a valid UUID");
    }

    if (!uuidRegex.test(dto.versionId)) {
      throw new JdValidationError("versionId must be a valid UUID");
    }
  }

  validateVersionId(versionId: string): void {
    if (!versionId || typeof versionId !== "string") {
      throw new JdValidationError("versionId is required and must be a string");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(versionId)) {
      throw new JdValidationError("versionId must be a valid UUID");
    }
  }
}
