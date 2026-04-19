import { EvaluateAtsDto } from "../dto/evaluate-ats.dto";
import { AtsValidationError } from "../domain/errors";

export class AtsInputValidator {
  validateEvaluateDto(dto: EvaluateAtsDto): void {
    if (!dto) {
      throw new AtsValidationError("Request body is required");
    }

    if (!dto.resumeId || typeof dto.resumeId !== "string") {
      throw new AtsValidationError("resumeId is required and must be a string");
    }

    if (!dto.versionId || typeof dto.versionId !== "string") {
      throw new AtsValidationError("versionId is required and must be a string");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(dto.resumeId)) {
      throw new AtsValidationError("resumeId must be a valid UUID");
    }

    if (!uuidRegex.test(dto.versionId)) {
      throw new AtsValidationError("versionId must be a valid UUID");
    }
  }

  validateVersionId(versionId: string): void {
    if (!versionId || typeof versionId !== "string") {
      throw new AtsValidationError("versionId is required and must be a string");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(versionId)) {
      throw new AtsValidationError("versionId must be a valid UUID");
    }
  }
}
