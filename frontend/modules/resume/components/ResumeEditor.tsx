import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeStore } from "../store/resume.store";
import { validateResumeJson } from "../utils/resume.validation";
import type { CanonicalResumeJson } from "../types/resume.dto";
import { ResumeSectionForm } from "./ResumeSectionForm";
import { ResumeJsonPreview } from "./ResumeJsonPreview";
import { PdfPreviewCard } from "./PdfPreviewCard";
import { EmptyResumeState } from "./EmptyResumeState";
import { SaveBar } from "./SaveBar";
import { VersionTimeline } from "./VersionTimeline";
import { sanitizeText } from "../utils/sanitize";
import type { ResumeVersionDto } from "../types/resume.dto";
import { ResumeSectionsSidebar } from "./ResumeSectionsSidebar";
import { ResumeTopBar } from "./ResumeTopBar";
import { ResumePreviewCard } from "./ResumePreviewCard";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeEditorHeader } from "./ResumeEditorHeader";
import { AssistantPanel } from "./AssistantPanel";
import { AiChatPanel } from "./AiChatPanel";
import { QuickActions } from "./QuickActions";
import { KeywordAssistant } from "./KeywordAssistant";
import { TemplateSelector } from "./TemplateSelector";
import { analyzeResumeWithAI, type AIAnalysisResult, renderResumePdf } from "../services/resume.api";
import html2pdf from "html2pdf.js";
import { useAiResumeBuilder } from "../hooks/useAiResumeBuilder";

type SectionKey =
  | "personal"
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "links";

const isBlankString = (s: string) => s.trim().length === 0;

const computeReadinessScore = (errors: Record<string, string>): number => {
  const count = Object.keys(errors).length;
  const raw = 100 - count * 10;
  return Math.max(0, raw);
};

const getScoreMessage = (score: number): { emoji: string; text: string; color: string } => {
  if (score < 30) return { emoji: "🚀", text: "Start building your resume", color: "text-blue-200" };
  if (score < 70) return { emoji: "⚡", text: "Good progress, keep improving", color: "text-yellow-200" };
  if (score < 90) return { emoji: "🔥", text: "Strong resume", color: "text-orange-200" };
  return { emoji: "🏆", text: "Excellent, ATS optimized", color: "text-green-200" };
};

const buildAssistantTips = (errors: Record<string, string>): string[] => {
  const tips: string[] = [];
  if (errors["basics.email"]) tips.push("Verify your email format so recruiters can contact you.");
  if (errors["skills"]) tips.push("Add at least 1 skill (skills must not be empty).");
  if (errors["projects.0.title"] || Object.keys(errors).some((k) => k.startsWith("projects.") && k.endsWith(".title"))) {
    tips.push("Ensure every project has a title.");
  }
  if (
    errors["projects.0.description"] ||
    Object.keys(errors).some((k) => k.startsWith("projects.") && k.endsWith(".description"))
  ) {
    tips.push("Ensure every project has a description.");
  }
  if (
    Object.keys(errors).some((k) => k.startsWith("experience.") && k.endsWith(".responsibilities"))
  ) {
    tips.push("For each experience, add at least one responsibility.");
  }
  if (tips.length === 0) {
    tips.push("Your resume is valid. Tailor skills/projects to the target job description for best match.");
  }
  return tips.slice(0, 5);
};

// Build resume text for AI analysis
const buildResumeText = (resumeJson: CanonicalResumeJson): string => {
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
};

export function ResumeEditor({
  canEdit,
  onSave,
  isSaving,
  disabledReason,
  pdfUrl,
  versions,
  currentVersionId,
  onVersionSelect,
}: {
  canEdit: boolean;
  onSave: (payload: { title: string; resumeJson: CanonicalResumeJson }) => void;
  isSaving?: boolean;
  disabledReason?: string;
  pdfUrl?: string | null;
  versions?: ResumeVersionDto[];
  currentVersionId?: string | null;
  onVersionSelect?: (versionId: string) => void;
}) {
  const navigate = useNavigate();
  const resume = useResumeStore((s) => s.resume);
  const resumeJson = useResumeStore((s) => s.resumeJson);
  const updateField = useResumeStore((s) => s.updateField);
  const [resumeTitle, setResumeTitle] = useState<string>(() => resume?.title ?? resumeJson.basics.name ?? "Resume");
  const timers = useRef<Record<string, ReturnType<typeof window.setTimeout> | null>>({});

  const errors = useMemo(() => validateResumeJson(resumeJson), [resumeJson]);
  const readinessScore = useMemo(() => computeReadinessScore(errors), [errors]);
  const assistantTips = useMemo(() => buildAssistantTips(errors), [errors]);

  const [activeSection, setActiveSection] = useState<SectionKey>("personal");

  // AI Analysis state
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const aiDebounceTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  // AI Resume Builder
  const { mutateAsync: generateResume, isPending: isGenerating } = useAiResumeBuilder();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAiResume, setPendingAiResume] = useState<CanonicalResumeJson | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Quick Action: Add Project
  const handleAddProject = () => {
    const currentProjects = resumeJson.projects || [];
    updateField('projects', [
      ...currentProjects,
      {
        title: 'New Project',
        description: '',
        techStack: [],
        link: '',
        startDate: '',
        endDate: ''
      }
    ]);
  };

  // Keyword Assistant: Add Keyword
  const handleAddKeyword = (keyword: string) => {
    const currentSkills = resumeJson.skills || [];
    if (!currentSkills.some((s: { name: string }) => s.name.toLowerCase() === keyword.toLowerCase())) {
      updateField('skills', [...currentSkills, { name: keyword, level: 'intermediate' }]);
    }
  };

  // Quick Action: Add Experience
  const handleAddExperience = () => {
    const currentExperience = resumeJson.experience || [];
    updateField('experience', [
      ...currentExperience,
      {
        company: '',
        role: '',
        duration: '',
        responsibilities: [''],
        location: ''
      }
    ]);
  };

  // Quick Action: Improve Summary
  const handleImproveSummary = async () => {
    if (!resumeJson.basics.summary) {
      updateField('basics.summary', 'Results-driven professional with expertise in...');
      return;
    }
    // Trigger AI analysis to get summary improvement
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeWithAI(resume?.id || '', buildResumeText(resumeJson));
      if (result.data?.suggestedSummary) {
        updateField('basics.summary', result.data.suggestedSummary);
      }
    } catch {
      // Silently fail - just show placeholder improvement
      updateField('basics.summary', resumeJson.basics.summary + ' Proven track record of delivering high-impact results.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Action: Suggest Skills
  const handleSuggestSkills = () => {
    const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'];
    const currentSkillNames = resumeJson.skills.map((s: { name: string }) => s.name.toLowerCase());
    const suggestedSkills = commonSkills
      .filter(s => !currentSkillNames.includes(s.toLowerCase()))
      .slice(0, 3)
      .map(name => ({ name, level: 'intermediate' as const }));
    
    updateField('skills', [...resumeJson.skills, ...suggestedSkills]);
  };

  // Handle AI full resume generation
  const handleGenerateFullResume = async () => {
    setAiError(null);
    try {
      const result = await generateResume({
        name: resumeJson.basics.name || "Software Engineer",
        role: "Software Engineer",
        skills: resumeJson.skills.map((s: { name: string }) => s.name),
      });

      // Store pending AI resume and show confirmation
      setPendingAiResume(result.data);
      setShowConfirmDialog(true);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to generate resume. Please try again.");
    }
  };

  // Handle confirmation to apply AI resume
  const handleConfirmApply = () => {
    if (pendingAiResume) {
      // Update all fields in the store
      Object.entries(pendingAiResume).forEach(([key, value]) => {
        updateField(key, value);
      });
      setPendingAiResume(null);
      setShowConfirmDialog(false);
      setAiError(null);
    }
  };

  // Handle save with timestamp update
  const handleSave = () => {
    onSave({ title: resumeTitle, resumeJson });
    setLastSavedAt(new Date());
  };

  const selectedTemplate = useResumeStore((s) => s.selectedTemplate);

  // Handle PDF export
  const handleExportPdf = async () => {
    if (!resume?.id) {
      alert('Please save the resume first');
      return;
    }
    
    try {
      const result = await renderResumePdf(resume.id, selectedTemplate);
      const responseData = result.data;
      
      if (responseData?.html) {
        // Create hidden iframe to render HTML for PDF generation
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '210mm'; // A4 width
        iframe.style.height = '297mm'; // A4 height
        document.body.appendChild(iframe);
        
        // Write HTML to iframe
        iframe.contentDocument?.open();
        iframe.contentDocument?.write(responseData.html);
        iframe.contentDocument?.close();
        
        // Wait for content to render then generate PDF
        setTimeout(() => {
          const element = iframe.contentDocument?.body;
          if (element) {
            const opt = {
              margin: 0,
              filename: `${resumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf`,
              image: { type: 'jpeg' as const, quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            
            html2pdf().set(opt).from(element).save().then(() => {
              document.body.removeChild(iframe);
            });
          }
        }, 500);
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (err: any) {
      alert(`Failed to generate PDF: ${err?.message || 'Unknown error'}`);
    }
  };

  // Handle resume update from AI chat
  const handleResumeUpdateFromChat = (updatedJson: CanonicalResumeJson) => {
    Object.entries(updatedJson).forEach(([key, value]) => {
      updateField(key, value);
    });
  };

  // Cancel AI apply
  const handleCancelApply = () => {
    setPendingAiResume(null);
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    const derived = resume?.title ?? resumeJson.basics.name;
    if (resumeTitle === "Resume" && derived) {
      setResumeTitle(derived);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume?.title, resumeJson.basics.name]);

  // Auto-analyze resume with debounce
  useEffect(() => {
    if (!resume?.id) return;

    // Clear existing timer
    if (aiDebounceTimer.current) {
      window.clearTimeout(aiDebounceTimer.current);
    }

    // Fast debounce for 500ms - feels snappier
    aiDebounceTimer.current = window.setTimeout(() => {
      const analyzeResume = async () => {
        setIsAnalyzing(true);
        try {
          const response = await analyzeResumeWithAI(resume.id);
          setAiData(response.data);
        } catch {
          // Error handled silently
        } finally {
          setIsAnalyzing(false);
        }
      };

      analyzeResume();
    }, 500);

    return () => {
      if (aiDebounceTimer.current) {
        window.clearTimeout(aiDebounceTimer.current);
      }
    };
  }, [resume?.id, resumeJson]);

  const debouncedUpdate = (path: string, value: unknown) => {
    const existing = timers.current[path];
    if (existing) window.clearTimeout(existing);
    timers.current[path] = window.setTimeout(() => {
      updateField(path, value);
    }, 250);
  };

  const isBlankResumeJson =
    isBlankString(resumeJson.basics.name) &&
    isBlankString(resumeJson.basics.email) &&
    isBlankString(resumeJson.basics.summary) &&
    resumeJson.skills.length === 0 &&
    resumeJson.projects.length === 0 &&
    resumeJson.experience.length === 0 &&
    resumeJson.education.length === 0 &&
    resumeJson.links.length === 0;

  if (!resume && isBlankResumeJson) {
    return (
      <div className="w-full rounded-xl bg-white p-8 shadow-md ring-1 ring-slate-200/80">
        <EmptyResumeState />
      </div>
    );
  }

  const sections: Array<{ key: SectionKey; label: string }> = [
    { key: "personal", label: "Personal Info" },
    { key: "summary", label: "Summary" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "links", label: "Links" },
  ];

  const sectionHasError = (key: SectionKey): boolean => {
    const knownPrefixes: Record<SectionKey, string[]> = {
      personal: ["basics.email"],
      summary: [],
      education: [],
      experience: ["experience."],
      skills: ["skills"],
      projects: ["projects."],
      links: [],
    };
    const prefixes = knownPrefixes[key] ?? [];
    return prefixes.some((p) => {
      if (p === "skills") return !!errors["skills"];
      if (p === "basics.email") return !!errors["basics.email"];
      return Object.keys(errors).some((errKey) => errKey.startsWith(p));
    });
  };

  const sectionErrors = sections.reduce((acc, s) => {
    acc[s.key] = sectionHasError(s.key);
    return acc;
  }, {} as Record<SectionKey, boolean>);

  // Section completion tracker
  const sectionCompletion: Record<SectionKey, boolean> = {
    personal: !!resumeJson.basics.name && !!resumeJson.basics.email,
    summary: !!resumeJson.basics.summary && resumeJson.basics.summary.length > 20,
    education: resumeJson.education.length > 0,
    experience: resumeJson.experience.length > 0,
    skills: resumeJson.skills.length > 0,
    projects: resumeJson.projects.length > 0,
    links: resumeJson.links.length > 0,
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      {/* SaaS DASHBOARD HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/app/resume')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to resume list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>
              <div className="w-10 h-10 bg-[#e8f3ff] rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-[#1a56db] text-lg font-bold">R</span>
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-gray-900">Resume Builder</h1>
                <p className="text-[13px] font-medium text-gray-500">Professional Profile</p>
              </div>
            </div>

            {/* Center: AI Build Button */}
            <button
              onClick={handleGenerateFullResume}
              disabled={isGenerating}
              className={[
                "hidden md:flex items-center gap-2 px-6 py-2 bg-white text-[#1a56db] border-2 border-[#1a56db] rounded-xl font-bold shadow-sm transition-all",
                isGenerating
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#1a56db] hover:text-white"
              ].join(" ")}
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Build</span>
                </>
              )}
            </button>

            {/* Right: Score Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Score:</span>
                <span className={`text-sm font-bold ${getScoreMessage(aiData?.score ?? readinessScore).color.replace('text-', 'text-').replace('200', '600')}`}>
                  {aiData?.score ?? readinessScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - 3 columns */}
          <aside className="col-span-12 lg:col-span-3 space-y-5">
            {/* Section Navigation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Sections
              </h2>
              <ResumeSectionsSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                sectionErrors={sectionErrors}
                sectionCompletion={sectionCompletion}
              />
            </div>

            {/* Mobile AI Button */}
            <button
              onClick={handleGenerateFullResume}
              disabled={isGenerating}
              className={[
                "md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0a66c2] text-white rounded-full font-semibold transition-colors",
                isGenerating ? "opacity-70 cursor-not-allowed" : "hover:bg-[#004182]"
              ].join(" ")}
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI Building...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Build</span>
                </>
              )}
            </button>

            {/* PDF Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <PdfPreviewCard pdfUrl={pdfUrl} />
            </div>

            {/* Version Timeline */}
            {versions && versions.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <VersionTimeline
                  versions={versions}
                  currentVersionId={currentVersionId}
                  onSelect={(id) => onVersionSelect?.(id)}
                />
              </div>
            ) : null}
          </aside>

          {/* CENTER CONTENT - 6 columns */}
          <section className="col-span-12 lg:col-span-6 space-y-5">
            {/* NEW: Resume Editor Header with Avatar, Title, Actions */}
            <ResumeEditorHeader
              resumeJson={resumeJson}
              resumeTitle={resumeTitle}
              setResumeTitle={setResumeTitle}
              canEdit={canEdit}
              onSave={handleSave}
              isSaving={isSaving}
              onAiImprove={handleGenerateFullResume}
              isAiImproving={isGenerating}
              onExportPdf={handleExportPdf}
            />

            {/* AI Status Messages */}
            {isGenerating && (
              <div className="bg-white border border-[#0a66c2] rounded-lg p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-[#e8f3ff] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0a66c2] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">AI is building your resume...</p>
                  <p className="text-xs text-gray-600">Generating professional content based on your profile</p>
                </div>
              </div>
            )}

            {aiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-900">AI generation failed</p>
                    <p className="text-xs text-red-600">{aiError}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiError(null)}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Resume Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <ResumeHeader
                resumeJson={resumeJson}
                resumeTitle={resumeTitle}
                score={aiData?.score ?? readinessScore}
                scoreMessage={getScoreMessage(aiData?.score ?? readinessScore)}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Editor Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {sections.find(s => s.key === activeSection)?.label}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  sectionCompletion[activeSection] 
                    ? 'bg-green-100 text-green-700' 
                    : sectionErrors[activeSection]
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {sectionCompletion[activeSection] ? '✓ Complete' : sectionErrors[activeSection] ? '✗ Needs Fix' : '⚠ In Progress'}
                </span>
              </div>
              
              <ResumeSectionForm
                section={activeSection}
                canEdit={canEdit}
                resumeJson={resumeJson}
                errors={errors}
                update={debouncedUpdate}
                resumeTitle={resumeTitle}
                setResumeTitle={setResumeTitle}
              />

              <div className="mt-8 pt-6 border-t border-slate-100">
                <SaveBar
                  canEdit={canEdit}
                  onSave={handleSave}
                  isSaving={isSaving}
                  disabledReason={disabledReason}
                  lastSavedAt={lastSavedAt}
                />
              </div>
            </div>
          </section>

          {/* RIGHT PANEL - 3 columns */}
          <aside className="col-span-12 lg:col-span-3 space-y-5 sticky top-24 h-max">
            
            {/* 1. AI Assistant Panel (Combined) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="px-4 py-3 border-b border-gray-100 bg-white">
                <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1a56db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  AI Assistant
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Status */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-gray-700">Resume Status</span>
                  <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md ${
                    (aiData?.score ?? readinessScore) >= 80 ? 'bg-green-100 text-green-700' : 
                    (aiData?.score ?? readinessScore) >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {(aiData?.score ?? readinessScore) >= 80 ? 'Good' : 'Needs Work'}
                  </span>
                </div>

                {/* AI Chat (Restored) */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <AiChatPanel
                    resumeJson={resumeJson}
                    onResumeUpdate={handleResumeUpdateFromChat}
                    onTitleUpdate={setResumeTitle}
                    resumeId={resume?.id}
                    currentTitle={resumeTitle}
                  />
                </div>

                {/* Quick Actions */}
                <QuickActions
                  onAddProject={handleAddProject}
                  onAddExperience={handleAddExperience}
                  onImproveSummary={handleImproveSummary}
                  onSuggestSkills={handleSuggestSkills}
                  onAiImprove={handleGenerateFullResume}
                />

                {/* Strengths & Improvements */}
                {(aiData?.strengths?.length || aiData?.weaknesses?.length) ? (
                  <div className="space-y-3">
                    {aiData?.strengths && aiData.strengths.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-green-700 mb-2">Strengths</p>
                        <ul className="space-y-1">
                          {aiData.strengths.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="text-[12px] text-green-700 font-medium leading-tight">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {aiData?.weaknesses && aiData.weaknesses.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-2">Improvements</p>
                        <ul className="space-y-1">
                          {aiData.weaknesses.slice(0, 2).map((w, idx) => (
                            <li key={idx} className="text-[12px] text-amber-700 font-medium leading-tight">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* 2. Keyword Assistant */}
            <KeywordAssistant 
              resumeJson={resumeJson} 
              onAddKeyword={handleAddKeyword} 
            />

            {/* 3. Popular Templates */}
            <TemplateSelector />

            {/* JSON Preview Card - Collapsed */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <details className="group">
                <summary className="px-4 py-3 bg-slate-50 cursor-pointer flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    JSON Preview
                  </h3>
                  <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <div className="p-4">
                  <ResumeJsonPreview resumeJson={resumeJson} />
                </div>
              </details>
            </div>
          </aside>
        </div>
      </main>

      {/* CONFIRMATION DIALOG */}
      {showConfirmDialog && pendingAiResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Apply AI Resume?</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              AI has generated a complete resume. This will replace your current data.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-slate-900">{pendingAiResume.basics.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {pendingAiResume.experience.length} experiences • {pendingAiResume.projects.length} projects • {pendingAiResume.skills.length} skills
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelApply}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Apply Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

