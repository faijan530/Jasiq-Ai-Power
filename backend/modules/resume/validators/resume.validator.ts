import { CanonicalResumeJson } from "../dto/create-resume.dto";
import { ValidationError } from "../domain/errors";

export class ResumeValidator {
  validateCanonicalSchema(json: CanonicalResumeJson): void {
    console.log("[ResumeValidator] Validating schema...", { 
      schemaVersion: json.schemaVersion, 
      hasBasics: !!json.basics,
      email: json.basics?.email,
      skillsCount: json.skills?.length,
      projectsCount: json.projects?.length
    });

    // Check schema version
    if (json.schemaVersion !== 1) {
      console.error("[ResumeValidator] FAILED: Invalid schema version:", json.schemaVersion);
      throw new ValidationError(`Invalid schema version: expected 1, got ${json.schemaVersion}`);
    }

    // Check email is valid (allow empty for drafts, but if provided must be valid)
    if (json.basics?.email && !this.isValidEmail(json.basics.email)) {
      console.error("[ResumeValidator] FAILED: Invalid email format:", json.basics.email);
      throw new ValidationError(`Invalid email format: ${json.basics.email}`);
    }

    // Check skills exist (allow empty for new resumes)
    if (!Array.isArray(json.skills)) {
      console.error("[ResumeValidator] FAILED: Skills is not an array");
      throw new ValidationError("Skills must be an array");
    }

    // Check projects have required fields
    for (let i = 0; i < (json.projects ?? []).length; i++) {
      const project = json.projects[i];
      if (!project.title) {
        console.error(`[ResumeValidator] FAILED: Project ${i + 1} missing title`);
        throw new ValidationError(`Project ${i + 1} is missing a title`);
      }
      if (!project.description) {
        console.error(`[ResumeValidator] FAILED: Project ${i + 1} missing description`);
        throw new ValidationError(`Project ${i + 1} is missing a description`);
      }
    }

    console.log("[ResumeValidator] Validation PASSED");
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

