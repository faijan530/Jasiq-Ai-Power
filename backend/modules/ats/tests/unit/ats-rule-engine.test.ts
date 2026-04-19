import { AtsRuleEngineService } from "../../service/ats-rule-engine.service";
import { NormalizedResume } from "../../service/ats-normalizer.service";
import { ResumeVersion } from "../../../resume/domain/entities/resume-version.entity";

describe("AtsRuleEngineService", () => {
  let ruleEngine: AtsRuleEngineService;

  beforeEach(() => {
    ruleEngine = new AtsRuleEngineService();
  });

  const createMockResume = (overrides: Partial<NormalizedResume> = {}): NormalizedResume => ({
    original: {} as ResumeVersion,
    normalizedText: "sample resume text with typescript and node.js",
    tokens: ["sample", "resume", "text", "with", "typescript", "and", "node.js"],
    sections: {
      skills: ["typescript", "javascript", "node.js", "react"],
      experience: [
        "Software Engineer at Company A - Built scalable applications using TypeScript and Node.js",
        "Frontend Developer at Company B - Developed responsive web applications with React",
      ],
      education: ["BS Computer Science - University X"],
      projects: ["Project A - Built with TypeScript"],
      ...overrides.sections,
    },
    ...overrides,
  });

  describe("evaluate", () => {
    it("should return section scores for complete resume", () => {
      const resume = createMockResume();
      const result = ruleEngine.evaluate(resume);

      expect(result.sectionScores).toBeDefined();
      expect(result.sectionScores.skills).toBeGreaterThan(0);
      expect(result.sectionScores.experience).toBeGreaterThan(0);
      expect(result.sectionScores.education).toBeGreaterThan(0);
      expect(result.sectionScores.formatting).toBeGreaterThan(0);
      expect(result.sectionScores.keywords).toBeGreaterThan(0);
    });

    it("should return keyword matches", () => {
      const resume = createMockResume();
      const result = ruleEngine.evaluate(resume);

      expect(result.keywordMatches).toBeDefined();
      expect(result.keywordMatches.length).toBeGreaterThan(0);
      
      const typescriptMatch = result.keywordMatches.find(km => km.keyword === "typescript");
      expect(typescriptMatch).toBeDefined();
      expect(typescriptMatch?.found).toBe(true);
    });

    it("should return issues for missing sections", () => {
      const resume = createMockResume({
        sections: {
          skills: [],
          experience: [],
          education: [],
        },
      });
      const result = ruleEngine.evaluate(resume);

      expect(result.issues.length).toBeGreaterThan(0);
      
      const skillsError = result.issues.find(i => i.section === "skills");
      expect(skillsError).toBeDefined();
      expect(skillsError?.type).toBe("error");
    });

    it("should give maximum skills score for many unique skills", () => {
      const resume = createMockResume({
        sections: {
          skills: Array.from({ length: 20 }, (_, i) => `skill${i}`),
        },
      });
      const result = ruleEngine.evaluate(resume);

      expect(result.sectionScores.skills).toBe(30);
    });

    it("should penalize formatting with few bullet points", () => {
      const resume = createMockResume({
        normalizedText: "no bullets here",
      });
      const result = ruleEngine.evaluate(resume);

      const formattingIssue = result.issues.find(i => i.section === "formatting" && i.message.includes("bullet"));
      expect(formattingIssue).toBeDefined();
    });
  });
});
