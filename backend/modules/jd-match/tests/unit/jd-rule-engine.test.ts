import { describe, it, expect } from "vitest";
import { JdRuleEngineService } from "../../service/jd-rule-engine.service";
import { NormalizedJd } from "../../service/jd-normalizer.service";

describe("JdRuleEngineService", () => {
  const ruleEngine = new JdRuleEngineService();

  const mockResumeJson = {
    schemaVersion: 1,
    basics: {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      location: "NYC",
      summary: "Software Engineer with React and Node.js experience",
    },
    skills: [
      { name: "JavaScript", level: "expert" },
      { name: "React", level: "intermediate" },
      { name: "Node.js", level: "intermediate" },
    ],
    projects: [
      {
        title: "Web App",
        description: "Full stack application",
        techStack: ["React", "Node.js"],
        link: "",
      },
    ],
    education: [],
    experience: [
      {
        company: "Tech Co",
        role: "Software Engineer",
        duration: "2020-2023",
        responsibilities: ["Developed React components"],
      },
    ],
    achievements: [],
    links: [],
  };

  describe("evaluate", () => {
    it("should calculate skills match score", () => {
      const normalizedJd: NormalizedJd = {
        normalizedText: "Looking for React and Node.js developers",
        extractedSkills: ["react", "node.js"],
        extractedKeywords: [],
        experienceRequirements: [],
        jobTitle: "Software Engineer",
      };

      const resumeSkills = ["javascript", "react", "node.js"];

      const result = ruleEngine.evaluate(mockResumeJson, normalizedJd, resumeSkills);

      expect(result.skillsMatch.matched).toContain("react");
      expect(result.skillsMatch.matched).toContain("node.js");
      expect(result.skillsMatch.score).toBeGreaterThan(0);
    });

    it("should identify missing skills", () => {
      const normalizedJd: NormalizedJd = {
        normalizedText: "Looking for Python and Django developers",
        extractedSkills: ["python", "django"],
        extractedKeywords: [],
        experienceRequirements: [],
        jobTitle: "Backend Developer",
      };

      const resumeSkills = ["javascript", "react"];

      const result = ruleEngine.evaluate(mockResumeJson, normalizedJd, resumeSkills);

      expect(result.skillsMatch.missing).toContain("python");
      expect(result.skillsMatch.missing).toContain("django");
      expect(result.skillsMatch.matched.length).toBe(0);
    });

    it("should calculate overall match score", () => {
      const normalizedJd: NormalizedJd = {
        normalizedText: "Software Engineer position",
        extractedSkills: ["javascript", "react"],
        extractedKeywords: ["team", "agile"],
        experienceRequirements: [],
        jobTitle: "Software Engineer",
      };

      const resumeSkills = ["javascript", "react", "node.js"];

      const result = ruleEngine.evaluate(mockResumeJson, normalizedJd, resumeSkills);

      expect(result.overallMatch).toBeGreaterThanOrEqual(0);
      expect(result.overallMatch).toBeLessThanOrEqual(100);
    });

    it("should calculate role fit score", () => {
      const normalizedJd: NormalizedJd = {
        normalizedText: "Software Engineer position",
        extractedSkills: [],
        extractedKeywords: [],
        experienceRequirements: [],
        jobTitle: "Software Engineer",
      };

      const resumeSkills: string[] = [];

      const result = ruleEngine.evaluate(mockResumeJson, normalizedJd, resumeSkills);

      expect(result.roleFit.score).toBeGreaterThanOrEqual(0);
      expect(result.roleFit.score).toBeLessThanOrEqual(20);
    });
  });
});
