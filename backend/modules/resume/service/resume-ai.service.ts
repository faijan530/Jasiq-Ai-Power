import OpenAI from "openai";
import dotenv from "dotenv";
import type { CanonicalResumeJson } from "../dto/create-resume.dto";

// Load environment variables
dotenv.config();

// Debug log for env variable
console.log("[ResumeAIService] GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");

// Groq client (OpenAI-compatible)
let groqClient: OpenAI | null = null;

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-70b-versatile";

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groqClient;
}

export interface AIAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export class ResumeAIService {
  private hasApiKey(): boolean {
    return !!process.env.GROQ_API_KEY;
  }

  private getMockAnalysis(): AIAnalysisResult {
    console.warn("[ResumeAIService] No GROQ_API_KEY found or API failed. Using mock AI responses.");
    return {
      score: 72,
      strengths: [
        "Clear structure with well-defined sections",
        "Technical skills are clearly listed",
        "Project descriptions are detailed",
      ],
      weaknesses: [
        "Missing quantifiable achievements",
        "Professional summary could be stronger",
        "Limited action verbs in experience section",
      ],
      suggestions: [
        "Add more quantifiable achievements with numbers (e.g., 'Increased sales by 25%')",
        "Include a compelling professional summary at the top",
        "Use stronger action verbs like 'Architected', 'Led', 'Optimized'",
      ],
    };
  }

  async analyzeResume(resumeJson: CanonicalResumeJson): Promise<AIAnalysisResult> {
    // Check for API key
    if (!this.hasApiKey()) {
      console.warn("[ResumeAIService] GROQ_API_KEY not found in environment. Using mock response.");
      return this.getMockAnalysis();
    }

    // Try primary model first
    try {
      console.log(`[ResumeAIService] Using Groq model: ${PRIMARY_MODEL}`);
      const result = await this.callGroqAPI(resumeJson, PRIMARY_MODEL);
      return result;
    } catch (primaryError) {
      console.warn(`[ResumeAIService] Primary model ${PRIMARY_MODEL} failed:`, (primaryError as Error).message);
      
      // Try fallback model
      try {
        console.log(`[ResumeAIService] Fallback model triggered: ${FALLBACK_MODEL}`);
        const result = await this.callGroqAPI(resumeJson, FALLBACK_MODEL);
        return result;
      } catch (fallbackError) {
        console.error(`[ResumeAIService] Fallback model ${FALLBACK_MODEL} also failed:`, (fallbackError as Error).message);
        console.warn("[ResumeAIService] Using mock response due to API failures.");
        return this.getMockAnalysis();
      }
    }
  }

  private async callGroqAPI(resumeJson: CanonicalResumeJson, model: string): Promise<AIAnalysisResult> {
    const client = getGroqClient();
    const resumeText = this.buildResumeText(resumeJson);

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are a professional ATS resume analyzer. Analyze the resume and return structured JSON with the following format:

{
  "score": number (0-100),
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["actionable suggestion 1", "suggestion 2", "suggestion 3"]
}

Rules:
- Score: 0-100 based on ATS compatibility and overall quality
- Strengths: What's working well in the resume
- Weaknesses: Areas that need improvement
- Suggestions: Specific, actionable improvements
- Return ONLY valid JSON, no markdown or additional text`,
        },
        {
          role: "user",
          content: `Analyze this resume:\n\n${resumeText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from Groq API");
    }

    try {
      const parsed = JSON.parse(content);
      return {
        score: parsed.score ?? 70,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        suggestions: parsed.suggestions || [],
      };
    } catch (parseError) {
      console.error("[ResumeAIService] JSON parsing failed:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }
  }

  async getSuggestions(resumeJson: CanonicalResumeJson): Promise<string[]> {
    const analysis = await this.analyzeResume(resumeJson);
    return analysis.suggestions;
  }

  async getStrengths(resumeJson: CanonicalResumeJson): Promise<string[]> {
    const analysis = await this.analyzeResume(resumeJson);
    return analysis.strengths;
  }

  async getWeaknesses(resumeJson: CanonicalResumeJson): Promise<string[]> {
    const analysis = await this.analyzeResume(resumeJson);
    return analysis.weaknesses;
  }

  private buildResumeText(resumeJson: CanonicalResumeJson): string {
    const { basics, skills, projects, experience, education } = resumeJson;

    return `RESUME

Name: ${basics.name || "Not provided"}
Summary: ${basics.summary || "Not provided"}
Email: ${basics.email || "Not provided"}
Location: ${basics.location || "Not provided"}

SKILLS:
${skills.map((s) => `- ${s.name} (${s.level})`).join("\n") || "None listed"}

EXPERIENCE:
${experience.map((e) => `- ${e.role} at ${e.company} (${e.duration})
  ${e.responsibilities.map((r) => `  • ${r}`).join("\n")}`).join("\n") || "None listed"}

PROJECTS:
${projects.map((p) => `- ${p.title}: ${p.description}
  Tech: ${p.techStack.join(", ") || "None specified"}`).join("\n") || "None listed"}

EDUCATION:
${education.map((edu) => `- ${edu.degree} from ${edu.institution} (${edu.startYear}-${edu.endYear})`).join("\n") || "None listed"}`;
  }

  // AI Chat - Process user message and optionally update resume
  async chatWithAI(
    message: string,
    resumeJson: CanonicalResumeJson,
    currentTitle?: string
  ): Promise<{ message: string; updatedJson?: CanonicalResumeJson; updatedTitle?: string }> {
    if (!this.hasApiKey()) {
      return {
        message: "I'm a demo AI assistant. In production mode, I would help you build and optimize your resume based on your requests.",
      };
    }

    try {
      const client = getGroqClient();
      const resumeText = this.buildResumeText(resumeJson);

      const response = await client.chat.completions.create({
        model: PRIMARY_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an AI Resume Assistant. Help users build and improve their resumes.

The user will send a message about what they want to do with their resume. Understand their intent and provide helpful responses.

CURRENT RESUME TITLE: ${currentTitle || "Not set"}

If they want to ADD or MODIFY content (e.g., "add a project", "improve my summary", "add experience"), return JSON with:
{
  "message": "Friendly response describing what you did",
  "action": "update",
  "updates": {
    "basics": { "summary": "new summary" }, // only if updating basics
    "experience": [{ role: "...", company: "...", duration: "...", responsibilities: [...] }], // for adding experience
    "projects": [{ title: "...", description: "...", techStack: [...] }], // for adding projects
    "skills": [{ name: "...", level: "Expert" }] // for adding skills
  },
  "updatedTitle": "New Resume Title" // ONLY if user explicitly asks to change/update the resume title
}

If they want to UPDATE the RESUME TITLE specifically (e.g., "set resume title to...", "change title to..."), return:
{
  "message": "I've updated your resume title",
  "action": "update",
  "updatedTitle": "The new title they requested"
}

If they just want information or advice, return:
{
  "message": "Your helpful response",
  "action": "info"
}

Current Resume:
${resumeText}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { message: "I didn't receive a response. Please try again." };
      }

      // Try to parse JSON response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Handle title-only update (no resume JSON changes)
          if (parsed.action === "update" && parsed.updatedTitle && !parsed.updates) {
            return {
              message: parsed.message || `Resume title updated to: "${parsed.updatedTitle}"`,
              updatedTitle: parsed.updatedTitle,
            };
          }

          if (parsed.action === "update" && parsed.updates) {
            // Merge updates with current resume
            const updatedJson: CanonicalResumeJson = {
              ...resumeJson,
              ...parsed.updates,
              // Handle array merges
              experience: parsed.updates.experience 
                ? [...resumeJson.experience, ...(parsed.updates.experience || [])]
                : resumeJson.experience,
              projects: parsed.updates.projects
                ? [...resumeJson.projects, ...(parsed.updates.projects || [])]
                : resumeJson.projects,
              skills: parsed.updates.skills
                ? [...resumeJson.skills, ...(parsed.updates.skills || [])]
                : resumeJson.skills,
              education: parsed.updates.education
                ? [...resumeJson.education, ...(parsed.updates.education || [])]
                : resumeJson.education,
              links: parsed.updates.links
                ? [...resumeJson.links, ...(parsed.updates.links || [])]
                : resumeJson.links,
              // Merge basics if provided
              basics: parsed.updates.basics
                ? { ...resumeJson.basics, ...parsed.updates.basics }
                : resumeJson.basics,
            };

            return {
              message: parsed.message || "I've updated your resume!",
              updatedJson,
              updatedTitle: parsed.updatedTitle,
            };
          }

          return { message: parsed.message || "Here's what I found:" };
        }
      } catch {
        // Not JSON, return as plain message
      }

      return { message: content };
    } catch (error) {
      console.error("[ResumeAIService] Chat error:", error);
      return {
        message: "Sorry, I encountered an error. Please try again.",
      };
    }
  }

  // Generate complete resume from scratch
  async generateFullResume(params: {
    name: string;
    role: string;
    skills?: string[];
  }): Promise<CanonicalResumeJson> {
    // Default mock resume structure
    const mockResume: CanonicalResumeJson = {
      schemaVersion: 1,
      basics: {
        name: params.name,
        email: "",
        phone: "",
        location: "",
        summary: `Experienced ${params.role} with a proven track record of delivering high-quality solutions.`,
      },
      skills: params.skills?.map((name) => ({ name, level: "Expert" })) || [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Expert" },
        { name: "TypeScript", level: "Advanced" },
      ],
      experience: [
        {
          role: params.role,
          company: "Tech Solutions Inc.",
          duration: "2022 - Present",
          responsibilities: [
            "Developed and maintained scalable web applications",
            "Collaborated with cross-functional teams",
            "Implemented best practices and coding standards",
          ],
        },
      ],
      projects: [
        {
          title: "E-Commerce Platform",
          description: "Built a full-stack e-commerce solution with payment integration",
          techStack: ["React", "Node.js", "PostgreSQL"],
          link: "",
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "University of Technology",
          startYear: "2018",
          endYear: "2022",
        },
      ],
      links: [],
      achievements: [],
    };

    if (!this.hasApiKey()) {
      console.warn("[ResumeAIService] No API key, returning mock resume");
      return mockResume;
    }

    try {
      const client = getGroqClient();

      const response = await client.chat.completions.create({
        model: PRIMARY_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an expert resume writer. Create a professional resume in JSON format.

Return ONLY valid JSON matching this exact structure:
{
  "schemaVersion": 1,
  "basics": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string - compelling professional summary"
  },
  "skills": [{ "name": "string", "level": "Beginner|Intermediate|Advanced|Expert" }],
  "experience": [{ "role": "string", "company": "string", "duration": "string", "responsibilities": ["string"] }],
  "projects": [{ "title": "string", "description": "string", "techStack": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "startYear": number, "endYear": number }],
  "links": [{ "label": "string", "url": "string" }]
}

Rules:
- Make it realistic and professional
- Include 2-3 work experiences
- Include 2-3 projects
- Include 5-8 skills relevant to the role
- Write compelling summaries and descriptions
- Use action verbs`,
          },
          {
            role: "user",
            content: `Create a professional resume for:
Name: ${params.name}
Target Role: ${params.role}
${params.skills?.length ? `Known Skills: ${params.skills.join(", ")}` : ""}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as CanonicalResumeJson;
      }

      throw new Error("Could not parse AI response as JSON");
    } catch (error) {
      console.error("[ResumeAIService] Generate resume error:", error);
      console.warn("[ResumeAIService] Returning mock resume as fallback");
      return mockResume;
    }
  }
}
