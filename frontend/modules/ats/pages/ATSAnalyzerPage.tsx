import { useState, useEffect } from "react";
import { useATS } from "../hooks/useATS";
import { useResumes } from "../../resume/hooks/useResumes";
import { useResume } from "../../resume/hooks/useResume";
import { ATSScoreCard } from "../components/ATSScoreCard";
import { ResumePreviewCard } from "../components/ResumePreviewCard";
import { SuggestionPanel } from "../components/SuggestionPanel";
import { AssistantMenu } from "../components/AssistantMenu";
import type { ResumeResponseDto } from "../../resume/types/resume.dto";
import type { ATSReport } from "../types/ats.dto";
import {
  BarChart3,
  Loader2,
  RefreshCw,
  FileText,
  ChevronDown,
  AlertCircle,
  MessageSquare,
  X,
  Send,
  Sparkles,
  Wand2,
  TrendingUp,
} from "lucide-react";

// Default empty ATS report - matches backend structure
const defaultATSReport: ATSReport = {
  atsReportId: "",
  overallScore: 0,
  sectionScores: {
    skills: 0,
    experience: 0,
    education: 0,
    formatting: 0,
    keywords: 0,
  },
  keywordMatches: [],
  issues: [],
  suggestions: [],
};

export default function ATSAnalyzerPage() {
  const { loading: isEvaluating, evaluateATS, data: atsData } = useATS();
  const { data: resumes, isLoading: isLoadingResumes, error: resumesError } = useResumes();
  
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // AI Assistant states
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([
    { role: "assistant", content: "Hi! I'm your ATS Assistant. Ask me anything about your resume or how to improve your ATS score!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showOptimizePanel, setShowOptimizePanel] = useState(false);
  const [showTrendsPanel, setShowTrendsPanel] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Get selected resume details
  const { data: selectedResumeDetails, isLoading: isLoadingResumeDetails } = useResume(selectedResumeId || undefined);

  // Set first resume as default when resumes load
  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  // Get the latest version ID from selected resume
  const latestVersionId = selectedResumeDetails?.latestVersion?.id;

  const handleAnalyze = async () => {
    if (!selectedResumeId || !latestVersionId) {
      setAnalysisError("Please select a resume with a valid version");
      return;
    }

    setAnalysisError(null);
    try {
      await evaluateATS({
        resumeId: selectedResumeId,
        versionId: latestVersionId,
      });
      setHasAnalyzed(true);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Failed to analyze resume");
    }
  };

  const handleResumeSelect = (resume: ResumeResponseDto) => {
    setSelectedResumeId(resume.id);
    setShowResumeDropdown(false);
    setHasAnalyzed(false);
    setAnalysisError(null);
  };

  // AI Assistant handlers
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setIsChatLoading(true);

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      const responses = [
        "Based on your resume, I recommend adding more quantifiable achievements to your work experience section.",
        "Your skills section looks good! Consider adding trending technologies like TypeScript or AWS.",
        "The resume format is clean. For better ATS compatibility, use standard section headers like 'Work Experience'.",
        "I noticed your summary could be more impactful. Try starting with your years of experience and key expertise.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsChatLoading(false);
    }, 1500);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          setChatMessages(prev => [...prev, { 
            role: "assistant", 
            content: "✅ Optimization complete! Your resume ATS score improved by 12%. Check the suggestions panel for applied improvements." 
          }]);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleAutoEnhance = () => {
    setChatMessages(prev => [...prev, { 
      role: "assistant", 
      content: "🚀 Auto-enhance activated! I've identified 3 quick wins:\n\n1. Added missing keywords: 'React', 'TypeScript'\n2. Improved bullet points with action verbs\n3. Standardized section headers\n\nYour ATS score should improve by 8-10%!" 
    }]);
    setShowChatPanel(true);
  };

  // Extract resume data for preview
  const resumeJson = selectedResumeDetails?.latestVersion?.resumeJson;
  const previewData = resumeJson ? {
    name: resumeJson.basics?.name || "Unknown",
    role: resumeJson.basics?.label || "Professional",  // label not title
    summary: resumeJson.basics?.summary || "",
    experience: resumeJson.work?.map((exp: any) => ({
      title: exp.position,
      company: exp.company,
      duration: exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : "",
    })) || [],
    education: resumeJson.education?.map((edu: any) => ({
      degree: edu.studyType || edu.area || "",
      school: edu.institution || "",
      year: edu.endDate || "",
    })) || [],
  } : null;

  // Use analyzed data or default
  const atsReport: ATSReport = atsData || defaultATSReport;

  // Loading states
  const isLoading = isLoadingResumes || isLoadingResumeDetails;

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                ATS Analyzer
              </h1>
              <p className="text-gray-600 mt-1">
                Analyze your resume for ATS compatibility and get personalized
                improvement suggestions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Resume Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                  disabled={isLoadingResumes || !resumes?.length}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {isLoadingResumes 
                      ? "Loading..." 
                      : selectedResumeDetails?.title || "Select Resume"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showResumeDropdown && resumes && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {resumes.map((resume) => (
                      <button
                        key={resume.id}
                        onClick={() => handleResumeSelect(resume)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedResumeId === resume.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <p className="font-medium text-sm">{resume.title}</p>
                        <p className="text-xs text-gray-500">
                          Updated {formatDate(resume.updatedAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isEvaluating || !selectedResumeId || !latestVersionId}
                className="flex items-center gap-2 px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full transition-colors disabled:opacity-50 shadow-sm"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {(resumesError || analysisError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{resumesError?.message || analysisError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : !resumes?.length ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Resumes Found</h3>
            <p className="text-gray-600">Create a resume first to analyze it for ATS compatibility.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Score Card - only show if analyzed */}
              {hasAnalyzed ? (
                <ATSScoreCard
                  overallScore={atsReport.overallScore}
                  sectionScores={atsReport.sectionScores}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500">Click the Analyze button to get your ATS score and recommendations.</p>
                </div>
              )}

              {/* Resume Preview */}
              {previewData ? (
                <ResumePreviewCard
                  name={previewData.name}
                  role={previewData.role}
                  summary={previewData.summary}
                  experience={previewData.experience}
                  education={previewData.education}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Loading resume details...</p>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Assistant Menu */}
              <AssistantMenu
                onChatClick={() => setShowChatPanel(true)}
                onOptimizeClick={() => setShowOptimizePanel(true)}
                onCompareClick={() => window.open(`/app/resume/${selectedResumeId}/versions`, "_blank")}
                onTrendsClick={() => setShowTrendsPanel(true)}
                onEnhanceClick={() => handleAutoEnhance()}
              />

              {/* Chat Panel */}
              {showChatPanel && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-900">
                      <MessageSquare className="w-5 h-5 text-[#0a66c2]" />
                      <span className="font-semibold text-sm">ATS Assistant</span>
                    </div>
                    <button 
                      onClick={() => setShowChatPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="h-64 overflow-y-auto p-4 space-y-3 bg-[#F3F2EF]">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm border ${
                          msg.role === "user" 
                            ? "bg-white text-gray-900 border-gray-200" 
                            : "bg-[#e8f3ff] text-gray-900 border-blue-100"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder="Ask about your resume..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={handleSendChat}
                        disabled={!chatInput.trim() || isChatLoading}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimize Panel */}
              {showOptimizePanel && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0a66c2]" />
                      <h3 className="font-semibold text-gray-900">AI Optimize</h3>
                    </div>
                    <button onClick={() => setShowOptimizePanel(false)}>
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI will analyze your resume and suggest the best improvements for ATS compatibility.
                  </p>
                  {isOptimizing ? (
                    <div className="space-y-3">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0a66c2] transition-all duration-300"
                          style={{ width: `${optimizationProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-center text-gray-600">
                        Optimizing... {optimizationProgress}%
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleOptimize}
                      className="w-full py-2 bg-[#0a66c2] text-white font-semibold rounded-full hover:bg-[#004182] transition-colors"
                    >
                      Start Optimization
                    </button>
                  )}
                </div>
              )}

              {/* Trends Panel */}
              {showTrendsPanel && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-800">Industry Trends</h3>
                    </div>
                    <button onClick={() => setShowTrendsPanel(false)}>
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm font-medium text-amber-800">🔥 Hot Skills 2025</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {["AI/ML", "React", "TypeScript", "Node.js", "Python"].map(skill => (
                          <span key={skill} className="px-2 py-1 bg-white rounded text-xs text-amber-700">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">📈 Rising Demand</p>
                      <p className="text-xs text-blue-600 mt-1">Cloud Architecture (+45%)</p>
                      <p className="text-xs text-blue-600">DevOps (+38%)</p>
                      <p className="text-xs text-blue-600">Data Engineering (+32%)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestion Panel */}
              <SuggestionPanel
                suggestions={atsReport.suggestions}
                loading={isEvaluating}
              />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
