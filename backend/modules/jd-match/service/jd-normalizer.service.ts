import { CanonicalResumeJson } from "../../resume/dto/create-resume.dto";

export interface NormalizedJd {
  normalizedText: string;
  extractedSkills: string[];
  extractedKeywords: string[];
  experienceRequirements: string[];
  jobTitle: string;
}

export class JdNormalizerService {
  private readonly commonTechSkills = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
    "react", "vue", "angular", "svelte", "next.js", "nuxt",
    "node.js", "express", "nestjs", "django", "flask", "spring",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "git", "github", "gitlab", "ci/cd", "jenkins",
    "rest api", "graphql", "websocket", "microservices",
    "agile", "scrum", "kanban", "jira",
    "machine learning", "ai", "data analysis", "tensorflow", "pytorch"
  ];

  private readonly experiencePatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi,
    /minimum\s+(\d+)\s*years?/gi,
    /at\s+least\s+(\d+)\s*years?/gi,
    /(\d+)-(\d+)\s*years?\s+(?:of\s+)?experience/gi,
  ];

  normalize(jdText: string): NormalizedJd {
    const cleaned = this.cleanJdText(jdText);
    const normalizedText = cleaned.toLowerCase();
    
    return {
      normalizedText: cleaned,
      extractedSkills: this.extractSkills(normalizedText),
      extractedKeywords: this.extractKeywords(normalizedText),
      experienceRequirements: this.extractExperienceRequirements(jdText),
      jobTitle: this.extractJobTitle(normalizedText, jdText),
    };
  }

  private cleanJdText(text: string): string {
    return text
      .replace(/\b[A-Z][a-z]+@[a-z]+\.[a-z]{2,}\b/g, "") // Remove emails
      .replace(/https?:\/\/[^\s]+/g, "") // Remove URLs
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "") // Remove phone numbers
      .replace(/(?:disclaimer|equal opportunity|eoe|privacy policy)[\s\S]*$/i, "") // Remove disclaimers
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractSkills(normalizedText: string): string[] {
    const foundSkills: string[] = [];
    
    for (const skill of this.commonTechSkills) {
      if (normalizedText.includes(skill)) {
        foundSkills.push(skill);
      }
    }

    // Extract from "skills" or "requirements" sections
    const skillsSection = this.extractSection(normalizedText, ["skills", "technical skills", "required skills", "qualifications"], ["experience", "benefits", "about us"]);
    if (skillsSection) {
      const bulletSkills = skillsSection
        .split(/[\n•\-]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 30);
      
      for (const skill of bulletSkills) {
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    }

    return [...new Set(foundSkills)].slice(0, 20);
  }

  private extractKeywords(normalizedText: string): string[] {
    const keywords: string[] = [];
    
    // Extract action verbs and important terms
    const actionVerbs = ["lead", "manage", "develop", "design", "implement", "optimize", "build", "create", "analyze", "coordinate"];
    const importantTerms = ["team", "remote", "full-time", "part-time", "contract", "senior", "junior", "lead", "principal"];
    
    for (const term of [...actionVerbs, ...importantTerms]) {
      if (normalizedText.includes(term)) {
        keywords.push(term);
      }
    }

    // Extract capitalized phrases (likely important)
    const capitalizedPhrases = normalizedText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const uniqueCapitalized = [...new Set(capitalizedPhrases)].filter(w => w.length > 3).slice(0, 10);
    
    return [...new Set([...keywords, ...uniqueCapitalized.map(w => w.toLowerCase())])].slice(0, 25);
  }

  private extractExperienceRequirements(text: string): string[] {
    const requirements: string[] = [];
    
    for (const pattern of this.experiencePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        requirements.push(match[0]);
      }
    }
    
    return [...new Set(requirements)].slice(0, 5);
  }

  private extractJobTitle(normalizedText: string, originalText: string): string {
    // Try to find job title in first few lines or after "Title:" or "Position:"
    const lines = originalText.split(/\n/).slice(0, 10);
    
    for (const line of lines) {
      const titleMatch = line.match(/(?:title|position|role)[:\s]+(.{5,60})/i);
      if (titleMatch) {
        return titleMatch[1].trim();
      }
    }
    
    // Try to find common job titles
    const commonTitles = [
      "software engineer", "senior software engineer", "junior software engineer",
      "frontend developer", "backend developer", "full stack developer",
      "devops engineer", "data scientist", "product manager",
      "ux designer", "qa engineer", "tech lead"
    ];
    
    for (const title of commonTitles) {
      if (normalizedText.includes(title)) {
        return title;
      }
    }
    
    return "Unknown Position";
  }

  private extractSection(text: string, startMarkers: string[], endMarkers: string[]): string | null {
    const lowerText = text.toLowerCase();
    
    for (const startMarker of startMarkers) {
      const startIndex = lowerText.indexOf(startMarker);
      if (startIndex !== -1) {
        let endIndex = text.length;
        
        for (const endMarker of endMarkers) {
          const markerIndex = lowerText.indexOf(endMarker, startIndex + startMarker.length);
          if (markerIndex !== -1 && markerIndex < endIndex) {
            endIndex = markerIndex;
          }
        }
        
        return text.slice(startIndex, endIndex).trim();
      }
    }
    
    return null;
  }

  extractResumeSkills(resumeJson: CanonicalResumeJson): string[] {
    const skills: string[] = [];
    
    // Direct skills array
    if (resumeJson.skills && Array.isArray(resumeJson.skills)) {
      skills.push(...resumeJson.skills.map((s) => s.name.toLowerCase()));
    }
    
    // Skills from projects
    if (resumeJson.projects && Array.isArray(resumeJson.projects)) {
      for (const project of resumeJson.projects) {
        if (project.techStack && Array.isArray(project.techStack)) {
          skills.push(...project.techStack.map((t) => t.toLowerCase()));
        }
        if (project.title) {
          const titleSkills = this.extractSkillsFromText(project.title.toLowerCase());
          skills.push(...titleSkills);
        }
      }
    }
    
    // Skills from experience
    if (resumeJson.experience && Array.isArray(resumeJson.experience)) {
      for (const exp of resumeJson.experience) {
        if (exp.role) {
          const roleSkills = this.extractSkillsFromText(exp.role.toLowerCase());
          skills.push(...roleSkills);
        }
        if (exp.responsibilities && Array.isArray(exp.responsibilities)) {
          for (const resp of exp.responsibilities) {
            const respSkills = this.extractSkillsFromText(resp.toLowerCase());
            skills.push(...respSkills);
          }
        }
      }
    }
    
    return [...new Set(skills)];
  }

  private extractSkillsFromText(text: string): string[] {
    const found: string[] = [];
    for (const skill of this.commonTechSkills) {
      if (text.includes(skill)) {
        found.push(skill);
      }
    }
    return found;
  }
}
