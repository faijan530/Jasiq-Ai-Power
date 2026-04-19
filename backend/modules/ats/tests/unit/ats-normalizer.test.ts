import { AtsNormalizerService, NormalizedResume } from "../../service/ats-normalizer.service";
import { ResumeVersion } from "../../../resume/domain/entities/resume-version.entity";

describe("AtsNormalizerService", () => {
  let normalizer: AtsNormalizerService;

  beforeEach(() => {
    normalizer = new AtsNormalizerService();
  });

  const createMockVersion = (resumeJson: any): ResumeVersion => ({
    id: "test-version-id",
    resumeId: "test-resume-id",
    versionNumber: 1,
    resumeJson,
    createdAt: new Date(),
  } as ResumeVersion);

  describe("normalize", () => {
    it("should normalize text to lowercase", () => {
      const version = createMockVersion({
        basics: { name: "John Doe", summary: "Software Developer" },
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.normalizedText).toContain("software developer");
      expect(result.normalizedText).not.toContain("Software Developer");
    });

    it("should extract tokens from resume", () => {
      const version = createMockVersion({
        basics: { summary: "typescript javascript node.js" },
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.tokens).toContain("typescript");
      expect(result.tokens).toContain("javascript");
      expect(result.tokens).toContain("node.js");
    });

    it("should detect skills section", () => {
      const version = createMockVersion({
        skills: ["typescript", "react", "node.js"],
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.sections.skills).toBeDefined();
      expect(result.sections.skills?.length).toBe(3);
    });

    it("should detect experience section", () => {
      const version = createMockVersion({
        experience: [
          { company: "Company A", role: "Developer" },
          { company: "Company B", role: "Engineer" },
        ],
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.sections.experience).toBeDefined();
      expect(result.sections.experience?.length).toBe(2);
    });

    it("should detect education section", () => {
      const version = createMockVersion({
        education: [
          { institution: "University A", degree: "BS" },
        ],
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.sections.education).toBeDefined();
      expect(result.sections.education?.length).toBe(1);
    });

    it("should detect projects section", () => {
      const version = createMockVersion({
        projects: [
          { title: "Project A", description: "A test project" },
        ],
      });
      
      const result = normalizer.normalize(version);
      
      expect(result.sections.projects).toBeDefined();
      expect(result.sections.projects?.length).toBe(1);
    });
  });

  describe("removeStopwords", () => {
    it("should remove common stopwords", () => {
      const tokens = ["the", "quick", "brown", "fox", "and", "dog"];
      const result = normalizer.removeStopwords(tokens);
      
      expect(result).not.toContain("the");
      expect(result).not.toContain("and");
      expect(result).toContain("quick");
      expect(result).toContain("brown");
    });
  });
});
