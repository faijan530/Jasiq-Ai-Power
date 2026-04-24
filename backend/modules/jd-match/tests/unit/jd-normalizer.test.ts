import { describe, it, expect } from "vitest";
import { JdNormalizerService } from "../../service/jd-normalizer.service";

describe("JdNormalizerService", () => {
  const normalizer = new JdNormalizerService();

  describe("normalize", () => {
    it("should extract skills from job description", () => {
      const jdText = `
        Senior Software Engineer
        
        We are looking for a skilled Software Engineer with 5+ years of experience in JavaScript, React, and Node.js.
        
        Required Skills:
        - TypeScript
        - PostgreSQL
        - AWS
        - Docker
        
        Contact us at jobs@company.com
      `;

      const result = normalizer.normalize(jdText);

      expect(result.extractedSkills).toContain("javascript");
      expect(result.extractedSkills).toContain("react");
      expect(result.extractedSkills).toContain("node.js");
      expect(result.extractedSkills).toContain("postgresql");
      expect(result.extractedSkills).toContain("aws");
      expect(result.extractedSkills).toContain("docker");
    });

    it("should extract job title", () => {
      const jdText = "Senior Software Engineer - Join our team!";
      const result = normalizer.normalize(jdText);
      expect(result.jobTitle).toContain("software engineer");
    });

    it("should extract experience requirements", () => {
      const jdText = `
        Requirements:
        - 3+ years of experience in web development
        - Minimum 5 years working with cloud platforms
        - At least 2 years in a leadership role
      `;

      const result = normalizer.normalize(jdText);
      expect(result.experienceRequirements.length).toBeGreaterThan(0);
    });

    it("should clean noise from JD", () => {
      const jdText = `
        Apply now! Contact jobs@company.com or call 555-123-4567
        Visit https://company.com/careers
        
        This is the actual job description.
        
        DISCLAIMER: Equal Opportunity Employer
      `;

      const result = normalizer.normalize(jdText);
      expect(result.normalizedText).not.toContain("jobs@company.com");
      expect(result.normalizedText).not.toContain("555-123-4567");
      expect(result.normalizedText).not.toContain("https://");
      expect(result.normalizedText).not.toContain("DISCLAIMER");
    });
  });

  describe("extractResumeSkills", () => {
    it("should extract skills from resume JSON", () => {
      const resumeJson = {
        schemaVersion: 1,
        basics: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          location: "NYC",
          summary: "Experienced developer",
        },
        skills: [
          { name: "JavaScript", level: "expert" },
          { name: "React", level: "intermediate" },
        ],
        projects: [
          {
            title: "E-commerce App",
            description: "Built with Node.js",
            techStack: ["Express", "MongoDB"],
            link: "",
          },
        ],
        education: [],
        experience: [],
        achievements: [],
        links: [],
      };

      const skills = normalizer.extractResumeSkills(resumeJson);

      expect(skills).toContain("javascript");
      expect(skills).toContain("react");
      expect(skills).toContain("express");
      expect(skills).toContain("mongodb");
    });
  });
});
