import { CanonicalResumeJson } from "../../resume/dto/create-resume.dto";
import { NormalizedJd } from "./jd-normalizer.service";

export interface SkillsMatchResult {
  matched: string[];
  missing: string[];
  score: number;
}

export interface KeywordMatchResult {
  found: string[];
  missing: string[];
  score: number;
}

export interface ExperienceMatchResult {
  hasRelevantExperience: boolean;
  yearsOverlap: number;
  score: number;
}

export interface RoleFitResult {
  score: number;
  matchedTerms: string[];
}

export interface JdMatchResult {
  overallMatch: number;
  skillsMatch: SkillsMatchResult;
  keywordMatch: KeywordMatchResult;
  experienceMatch: ExperienceMatchResult;
  roleFit: RoleFitResult;
}

export class JdRuleEngineService {
  evaluate(
    resumeJson: CanonicalResumeJson,
    normalizedJd: NormalizedJd,
    resumeSkills: string[]
  ): JdMatchResult {
    const skillsMatch = this.calculateSkillsMatch(resumeSkills, normalizedJd.extractedSkills);
    const keywordMatch = this.calculateKeywordMatch(resumeJson, normalizedJd.extractedKeywords);
    const experienceMatch = this.calculateExperienceMatch(resumeJson, normalizedJd.experienceRequirements);
    const roleFit = this.calculateRoleFit(resumeJson, normalizedJd.jobTitle);

    const overallMatch = Math.min(100, Math.round(
      skillsMatch.score + 
      experienceMatch.score + 
      keywordMatch.score + 
      roleFit.score
    ));

    return {
      overallMatch,
      skillsMatch,
      keywordMatch,
      experienceMatch,
      roleFit,
    };
  }

  private calculateSkillsMatch(resumeSkills: string[], jdSkills: string[]): SkillsMatchResult {
    if (jdSkills.length === 0) {
      return { matched: [], missing: [], score: 20 };
    }

    const matched: string[] = [];
    const missing: string[] = [];

    for (const jdSkill of jdSkills) {
      const jdSkillLower = jdSkill.toLowerCase();
      const isMatch = resumeSkills.some((rs) => 
        rs === jdSkillLower || 
        rs.includes(jdSkillLower) || 
        jdSkillLower.includes(rs)
      );
      
      if (isMatch) {
        matched.push(jdSkill);
      } else {
        missing.push(jdSkill);
      }
    }

    const matchRatio = matched.length / jdSkills.length;
    const score = Math.round(matchRatio * 40);

    return { matched, missing, score };
  }

  private calculateKeywordMatch(resumeJson: CanonicalResumeJson, jdKeywords: string[]): KeywordMatchResult {
    if (jdKeywords.length === 0) {
      return { found: [], missing: [], score: 10 };
    }

    const resumeText = this.buildResumeText(resumeJson).toLowerCase();
    const found: string[] = [];
    const missing: string[] = [];

    for (const keyword of jdKeywords) {
      if (resumeText.includes(keyword.toLowerCase())) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    }

    const matchRatio = found.length / jdKeywords.length;
    const score = Math.round(matchRatio * 20);

    return { found, missing, score };
  }

  private calculateExperienceMatch(
    resumeJson: CanonicalResumeJson,
    experienceRequirements: string[]
  ): ExperienceMatchResult {
    const hasProjects = resumeJson.projects && resumeJson.projects.length > 0;
    const hasExperience = resumeJson.experience && resumeJson.experience.length > 0;
    
    if (!hasProjects && !hasExperience) {
      return { hasRelevantExperience: false, yearsOverlap: 0, score: 0 };
    }

    // Check if projects or experience relate to the required skills
    let relevantProjects = 0;
    let relevantExperience = 0;

    if (hasProjects) {
      for (const project of resumeJson.projects) {
        if (project.title && project.description) {
          relevantProjects++;
        }
      }
    }

    if (hasExperience) {
      for (const exp of resumeJson.experience) {
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          relevantExperience++;
        }
      }
    }

    const hasRelevantExperience = relevantProjects > 0 || relevantExperience > 0;
    const yearsOverlap = this.estimateYearsOfExperience(resumeJson.experience);
    
    // Parse required years from JD
    let requiredYears = 0;
    for (const req of experienceRequirements) {
      const match = req.match(/(\d+)/);
      if (match) {
        requiredYears = Math.max(requiredYears, parseInt(match[1], 10));
      }
    }

    let score = 10;
    if (hasRelevantExperience) {
      score += 5;
    }
    if (yearsOverlap >= requiredYears) {
      score += 5;
    }

    return { hasRelevantExperience, yearsOverlap, score };
  }

  private calculateRoleFit(resumeJson: CanonicalResumeJson, jobTitle: string): RoleFitResult {
    // Get title from latest experience role or summary
    const latestExperience = resumeJson.experience?.[0];
    const resumeTitle = (latestExperience?.role || "").toLowerCase();
    const resumeSummary = (resumeJson.basics?.summary || "").toLowerCase();
    const normalizedJobTitle = jobTitle.toLowerCase();
    
    const matchedTerms: string[] = [];
    let score = 0;

    // Extract key terms from job title
    const jobTitleTerms = normalizedJobTitle
      .replace(/senior|junior|lead|principal|staff/g, "")
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 2);

    for (const term of jobTitleTerms) {
      if (resumeTitle.includes(term) || resumeSummary.includes(term)) {
        matchedTerms.push(term);
      }
    }

    const matchRatio = jobTitleTerms.length > 0 ? matchedTerms.length / jobTitleTerms.length : 0;
    score = Math.round(matchRatio * 20);

    // Bonus for exact or close title match
    if (resumeTitle && this.calculateStringSimilarity(resumeTitle, normalizedJobTitle) > 0.6) {
      score = Math.min(20, score + 5);
    }

    return { score, matchedTerms };
  }

  private estimateYearsOfExperience(experience: any[] | undefined): number {
    if (!experience || experience.length === 0) {
      return 0;
    }

    let totalYears = 0;
    for (const exp of experience) {
      if (exp.duration) {
        const match = exp.duration.match(/(\d{4})/g);
        if (match && match.length >= 2) {
          const start = parseInt(match[0], 10);
          const end = parseInt(match[match.length - 1], 10);
          if (end >= start) {
            totalYears += Math.max(1, end - start);
          }
        }
      }
    }

    return totalYears;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private buildResumeText(resumeJson: CanonicalResumeJson): string {
    const parts: string[] = [];
    
    if (resumeJson.basics) {
      parts.push(resumeJson.basics.name || "");
      parts.push(resumeJson.basics.summary || "");
    }
    
    if (resumeJson.skills) {
      parts.push(...resumeJson.skills.map((s) => s.name));
    }
    
    if (resumeJson.projects) {
      for (const p of resumeJson.projects) {
        parts.push(p.title || "");
        parts.push(p.description || "");
        parts.push(...(p.techStack || []));
      }
    }
    
    if (resumeJson.experience) {
      for (const e of resumeJson.experience) {
        parts.push(e.role || "");
        parts.push(e.company || "");
        parts.push(...(e.responsibilities || []));
      }
    }
    
    return parts.join(" ").toLowerCase();
  }
}
