import { ResumeValidator } from "../../validators/resume.validator";
import { ValidationError } from "../../domain/errors";
import { CanonicalResumeJson } from "../../dto/create-resume.dto";

describe("ResumeValidator", () => {
  const validator = new ResumeValidator();

  const baseJson: CanonicalResumeJson = {
    schemaVersion: 1,
    basics: {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      location: "City",
      summary: "Software engineer",
    },
    skills: [{ name: "TypeScript", level: "Advanced" }],
    projects: [
      {
        title: "Project A",
        description: "Did something",
        techStack: ["TS"],
        link: "https://example.com",
      },
    ],
    education: [],
    experience: [],
    achievements: [],
    links: [],
  };

  it("accepts a valid resume JSON", () => {
    expect(() => validator.validateCanonicalSchema(baseJson)).not.toThrow();
  });

  it("rejects invalid schemaVersion", () => {
    const invalid = { ...baseJson, schemaVersion: 2 };
    expect(() => validator.validateCanonicalSchema(invalid as CanonicalResumeJson)).toThrow(ValidationError);
  });

  it("rejects invalid email", () => {
    const invalid = { ...baseJson, basics: { ...baseJson.basics, email: "not-an-email" } };
    expect(() => validator.validateCanonicalSchema(invalid as CanonicalResumeJson)).toThrow(ValidationError);
  });

  it("rejects empty skills", () => {
    const invalid = { ...baseJson, skills: [] };
    expect(() => validator.validateCanonicalSchema(invalid as CanonicalResumeJson)).toThrow(ValidationError);
  });

  it("rejects project without title", () => {
    const invalid = {
      ...baseJson,
      projects: [{ ...baseJson.projects[0], title: "" }],
    };
    expect(() => validator.validateCanonicalSchema(invalid as CanonicalResumeJson)).toThrow(ValidationError);
  });
});

