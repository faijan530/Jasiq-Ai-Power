import { CanonicalResumeJson } from "../../resume/dto/create-resume.dto";
import { NormalizedJd } from "./jd-normalizer.service";
import { JdMatchSuggestion } from "../domain/entities/jd-match-report.entity";

export interface JdAiFeedbackConfig {
  enabled: boolean;
  apiKey?: string;
  model?: string;
}

export interface JdAiFeedbackResult {
  suggestions: JdMatchSuggestion[];
  summaryAdvice?: string;
  skillGapAnalysis?: string;
}

export class JdAiFeedbackService {
  constructor(private readonly config: JdAiFeedbackConfig = { enabled: false }) {}

  async generateSuggestions(
    resumeJson: CanonicalResumeJson,
    jdData: NormalizedJd,
    skillsMatch: { matched: string[]; missing: string[] }
  ): Promise<JdAiFeedbackResult> {
    if (!this.config.enabled) {
      return this.generateMockSuggestions(resumeJson, jdData, skillsMatch);
    }

    try {
      return await this.callAiApi(resumeJson, jdData, skillsMatch);
    } catch (error) {
      console.warn("[JdAiFeedbackService] AI API failed, using mock suggestions:", error);
      return this.generateMockSuggestions(resumeJson, jdData, skillsMatch);
    }
  }

  private async callAiApi(
    resumeJson: CanonicalResumeJson,
    jdData: NormalizedJd,
    skillsMatch: { matched: string[]; missing: string[] }
  ): Promise<JdAiFeedbackResult> {
    // Placeholder for actual AI API integration
    // Implement with Groq, OpenAI, or Gemini as needed
    
    const prompt = this.buildPrompt(resumeJson, jdData, skillsMatch);
    
    // Mock API call - replace with actual implementation
    console.log("[JdAiFeedbackService] AI Prompt:", prompt);
    
    return this.generateMockSuggestions(resumeJson, jdData, skillsMatch);
  }

  private generateMockSuggestions(
    resumeJson: CanonicalResumeJson,
    jdData: NormalizedJd,
    skillsMatch: { matched: string[]; missing: string[] }
  ): JdAiFeedbackResult {
    const suggestions: JdMatchSuggestion[] = [];

    // Missing skills suggestions
    if (skillsMatch.missing.length > 0) {
      const highPriorityMissing = skillsMatch.missing.slice(0, 3);
      suggestions.push({
        type: "skill",
        message: `Consider adding these key skills to your resume: ${highPriorityMissing.join(", ")}. You can include them in your skills section or highlight them in project descriptions.`,
        priority: "high",
      });
    }

    // Experience gap suggestion
    if (!resumeJson.experience || resumeJson.experience.length === 0) {
      suggestions.push({
        type: "experience",
        message: "Add relevant work experience or internships to strengthen your application. Include specific achievements and technologies used.",
        priority: "high",
      });
    }

    // Summary improvement
    const currentSummary = resumeJson.basics?.summary || "";
    if (currentSummary.length < 50) {
      suggestions.push({
        type: "general",
        message: `Expand your professional summary to better align with "${jdData.jobTitle}". Highlight relevant achievements and include keywords from the job description.`,
        priority: "medium",
      });
    }

    // Project suggestions
    if (!resumeJson.projects || resumeJson.projects.length < 2) {
      suggestions.push({
        type: "experience",
        message: "Add more projects that demonstrate your technical capabilities. Include projects that use technologies mentioned in the job description.",
        priority: "medium",
      });
    }

    // Keyword optimization
    if (jdData.extractedKeywords.length > 0) {
      const keywordsToAdd = jdData.extractedKeywords
        .filter((k) => !this.hasKeywordInResume(resumeJson, k))
        .slice(0, 5);
      
      if (keywordsToAdd.length > 0) {
        suggestions.push({
          type: "keyword",
          message: `Consider incorporating these keywords naturally into your resume: ${keywordsToAdd.join(", ")}.`,
          priority: "low",
        });
      }
    }

    return {
      suggestions,
      summaryAdvice: this.generateSummaryAdvice(resumeJson, jdData),
      skillGapAnalysis: this.generateSkillGapAnalysis(skillsMatch),
    };
  }

  private buildPrompt(
    resumeJson: CanonicalResumeJson,
    jdData: NormalizedJd,
    skillsMatch: { matched: string[]; missing: string[] }
  ): string {
    return `
Analyze this resume against the job description and provide actionable suggestions.

JOB TITLE: ${jdData.jobTitle}

JOB DESCRIPTION:
${jdData.normalizedText.substring(0, 500)}...

REQUIRED SKILLS: ${jdData.extractedSkills.join(", ")}

RESUME SUMMARY: ${resumeJson.basics?.summary || "Not provided"}
RESUME SKILLS: ${resumeJson.skills?.map((s) => s.name).join(", ") || "None"}
MATCHED SKILLS: ${skillsMatch.matched.join(", ")}
MISSING SKILLS: ${skillsMatch.missing.join(", ")}

Provide:
1. Top 3 specific suggestions to improve match
2. Skills to add or emphasize
3. Resume summary rewrite suggestion
4. Priority level for each suggestion (high/medium/low)

Respond in JSON format with array of suggestions.
`;
  }

  private hasKeywordInResume(resumeJson: CanonicalResumeJson, keyword: string): boolean {
    const text = JSON.stringify(resumeJson).toLowerCase();
    return text.includes(keyword.toLowerCase());
  }

  private generateSummaryAdvice(resumeJson: CanonicalResumeJson, jdData: NormalizedJd): string {
    const jobTitle = jdData.jobTitle;
    
    return `Consider rewriting your professional summary to:
1. Lead with your expertise in ${jobTitle.toLowerCase()} or related areas
2. Include 2-3 key achievements with metrics
3. Mention ${Math.min(3, jdData.extractedSkills.length)} relevant skills from the job posting
4. Keep it concise (3-4 sentences maximum)`;
  }

  private generateSkillGapAnalysis(skillsMatch: { matched: string[]; missing: string[] }): string {
    const matchRate = skillsMatch.matched.length / (skillsMatch.matched.length + skillsMatch.missing.length);
    
    if (matchRate >= 0.7) {
      return `Strong skill match (${Math.round(matchRate * 100)}%). You're well-qualified for this role. Consider highlighting your expertise in ${skillsMatch.matched.slice(0, 3).join(", ")}.`;
    } else if (matchRate >= 0.4) {
      return `Moderate skill match (${Math.round(matchRate * 100)}%). You have ${skillsMatch.matched.length} of the required skills. Focus on acquiring or demonstrating ${skillsMatch.missing.slice(0, 3).join(", ")}.`;
    } else {
      return `Skill gap identified (${Math.round(matchRate * 100)}% match). This role requires skills you may need to develop. Consider roles that better match your current skillset: ${skillsMatch.matched.join(", ")}.`;
    }
  }
}
