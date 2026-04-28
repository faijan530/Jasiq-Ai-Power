import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { getResume, getResumes, getResumeVersions, renderResumePdf } from "../services/resume.api";

// Inline SVG icons to avoid lucide-react compatibility issues
const IconFileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconEdit3 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const IconEye = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconDownload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const IconClock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>
);
const IconSparkles = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const IconTrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
const IconAward = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 22 12 20 17 22 15.79 13.88"/></svg>
);
import type { ResumeResponseDto, ResumeVersionDto } from "../types/resume.dto";
import { logEvent } from "../utils/logEvent";
import { useCreateResume } from "../hooks/useResume";
import {
  applyCreateResumeServerDefaults,
  DEFAULT_NEW_RESUME_TITLE,
  getDefaultResumeJson,
} from "../utils/defaultResume";
import { isValidEmail } from "../utils/email";

interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
  email?: string;
}

export function ResumeListPage({ currentUser }: { currentUser: CurrentUser }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: createResumeMutation, isPending: isCreating } = useCreateResume();
  
  // Prefetch resume on hover for instant navigation
  const prefetchResume = (resumeId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["resume", resumeId],
      queryFn: () => getResume(resumeId).then(r => r.data),
      staleTime: 10000,
    });
    queryClient.prefetchQuery({
      queryKey: ["resume_versions", resumeId],
      queryFn: () => getResumeVersions(resumeId).then(r => r.data),
      staleTime: 10000,
    });
  };
  const [contactEmail, setContactEmail] = useState(currentUser.email ?? "");
  const [createError, setCreateError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const envelope = await getResumes();
      return envelope.data;
    },
  });

  const handleCreateResume = async () => {
    setCreateError(null);
    if (!isValidEmail(contactEmail)) {
      setCreateError("Enter a valid work email before creating a resume (required by the server).");
      return;
    }

    try {
      const resumeJson = applyCreateResumeServerDefaults(getDefaultResumeJson(), contactEmail);
      const res = await createResumeMutation({
        title: DEFAULT_NEW_RESUME_TITLE,
        resumeJson,
      });

      if (!res?.resumeId) {
        throw new Error("Invalid response: missing resumeId");
      }

      logEvent("resume_created", { resumeId: res.resumeId, source: "list_create" });
      navigate(`/app/resume/${res.resumeId}/edit`);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Failed to create resume");
    }
  };

  const createButtonClass =
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

  const createControls =
    currentUser.role === "STUDENT" ? (
      <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-center">
        <div className="w-full max-w-sm text-left">
          <label htmlFor="resume-contact-email" className="text-xs font-semibold text-slate-600">
            Work email
          </label>
          <input
            id="resume-contact-email"
            type="email"
            autoComplete="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-blue-100 focus:border-blue-500 focus:outline-none focus:ring-2"
            placeholder="you@company.com"
          />
        </div>
        <button type="button" disabled={isCreating} onClick={handleCreateResume} className={createButtonClass}>
          {isCreating ? "Creating…" : "Create Resume"}
        </button>
      </div>
    ) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
        <div className="mx-auto max-w-7xl">
          {/* Skeleton Header */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg shadow-blue-900/5">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-12 w-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
          {/* Skeleton Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-lg shadow-blue-900/5 h-48">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-10 flex-1 bg-gray-100 rounded-xl animate-pulse"></div>
                  <div className="h-10 flex-1 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 p-4 flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load resumes</h3>
          <p className="text-sm text-slate-600 mb-4">{(error as Error)?.message ?? "Something went wrong"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const resumes = (data ?? []).filter((r: ResumeResponseDto) => r.tenantId === currentUser.tenantId);

  if (!resumes.length) {
    return (
      <div className="min-h-screen bg-[#F3F2EF] p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 px-8 py-8 text-center">
              <div className="w-16 h-16 bg-[#e8f3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileText className="w-8 h-8 text-[#0a66c2]" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Resume Builder</h1>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Create a professional, AI-powered resume to stand out. Start your first resume in seconds.
              </p>
            </div>
            
            {/* Empty State Content */}
            <div className="p-8">
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: IconSparkles, label: "AI Powered" },
                    { icon: IconTrendingUp, label: "ATS Optimized" },
                    { icon: IconAward, label: "Professional" },
                  ].map((feature, idx) => (
                    <div 
                      key={feature.label}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <feature.icon className="w-5 h-5 text-[#0a66c2]" />
                      <span className="text-xs font-medium text-gray-600">{feature.label}</span>
                    </div>
                  ))}
                </div>
                
                {createError ? (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {createError}
                  </div>
                ) : null}
                
                {currentUser.role === "STUDENT" ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="resume-contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Work Email <span className="text-gray-400 font-normal">(Required)</span>
                      </label>
                      <input
                        id="resume-contact-email"
                        type="email"
                        autoComplete="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#0a66c2] focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                        placeholder="you@company.com"
                      />
                    </div>
                    <button 
                      type="button" 
                      disabled={isCreating} 
                      onClick={handleCreateResume}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0a66c2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconPlus className="w-4 h-4" />
                          Create New Resume
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-600 text-sm">Only students can create resumes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate completion score from resume JSON
  const getCompletionScore = (resume: ResumeResponseDto) => {
    const json = resume.latestVersion?.resumeJson;
    if (!json) return 0;
    
    let score = 0;
    let total = 4;
    
    if (json.basics?.name && json.basics.name !== "Your Name") score++;
    if (json.basics?.summary && json.basics.summary.length > 20) score++;
    if (json.skills?.length > 0) score++;
    if (json.experience?.length > 0) score++;
    
    return Math.round((score / total) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <IconFileText className="w-6 h-6 text-[#0a66c2]" />
                Your Resumes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} • Manage and create professional profiles
              </p>
            </div>
            
            {currentUser.role === "STUDENT" ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-[220px]">
                  <label htmlFor="resume-contact-email-header" className="text-xs font-medium text-gray-700 block mb-1">
                    Work Email
                  </label>
                  <input
                    id="resume-contact-email-header"
                    type="email"
                    autoComplete="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0a66c2] focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                    placeholder="you@company.com"
                  />
                </div>
                <button 
                  type="button" 
                  disabled={isCreating} 
                  onClick={handleCreateResume}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a66c2] px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <IconPlus className="w-4 h-4" />
                  )}
                  {isCreating ? "Creating…" : "New Resume"}
                </button>
              </div>
            ) : null}
          </div>
          
          {createError && (
            <div className="border-t border-red-200 bg-red-50 px-6 py-3">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {createError}
              </p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#e8f3ff] rounded-md">
              <IconFileText className="w-6 h-6 text-[#0a66c2]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{resumes.length}</p>
              <p className="text-sm text-gray-500">Total Resumes</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-md">
              <IconSparkles className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {resumes.filter(r => getCompletionScore(r) >= 80).length}
              </p>
              <p className="text-sm text-gray-500">Complete Profiles</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-md">
              <IconClock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {resumes.filter(r => {
                  const days = (Date.now() - new Date(r.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
                  return days < 7;
                }).length}
              </p>
              <p className="text-sm text-gray-500">Updated This Week</p>
            </div>
          </div>
        </div>
        {/* Interactive Resume Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume, index) => {
            const completionScore = getCompletionScore(resume);
            
            return (
              <div
                key={resume.id}
                className="rounded-lg bg-white p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                onMouseEnter={() => {
                  setHoveredCard(resume.id);
                  prefetchResume(resume.id);
                }}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#e8f3ff] rounded-md">
                      <IconFileText className="w-5 h-5 text-[#0a66c2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{resume.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <IconClock className="w-3 h-3" />
                        {new Date(resume.updatedAt).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Version Badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      v{resume.latestVersion?.versionNumber ?? 1}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-5 flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Profile Completion</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {completionScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0a66c2]"
                      style={{ width: `${completionScore}%` }}
                    />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-gray-100">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">
                      {resume.latestVersion?.resumeJson?.skills?.length ?? 0}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Skills</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <p className="text-base font-semibold text-gray-900">
                      {resume.latestVersion?.resumeJson?.experience?.length ?? 0}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">
                      {resume.latestVersion?.resumeJson?.education?.length ?? 0}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Education</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/app/resume/${resume.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-[#0a66c2] transition-colors hover:bg-[#e8f3ff]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      window.open(`/app/resume/${resume.id}`, '_blank');
                    }}
                    className="p-1.5 rounded-full border-2 border-gray-500 text-gray-600 hover:bg-gray-100 transition-colors px-4 flex items-center justify-center"
                    title="Preview"
                  >
                    <IconEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      try {
                        const result = await renderResumePdf(resume.id);
                        const responseData = result.data;
                        
                        if (responseData?.html) {
                          const iframe = document.createElement('iframe');
                          iframe.style.position = 'absolute';
                          iframe.style.left = '-9999px';
                          iframe.style.width = '210mm';
                          iframe.style.height = '297mm';
                          document.body.appendChild(iframe);
                          
                          iframe.contentDocument?.open();
                          iframe.contentDocument?.write(responseData.html);
                          iframe.contentDocument?.close();
                          
                          setTimeout(() => {
                            const element = iframe.contentDocument?.body;
                            if (element) {
                              const opt = {
                                margin: 0,
                                filename: `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf`,
                                image: { type: 'jpeg', quality: 0.98 },
                                html2canvas: { scale: 2, useCORS: true },
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                              };
                              
                              html2pdf().set(opt).from(element).save().then(() => {
                                document.body.removeChild(iframe);
                              });
                            }
                          }, 500);
                        } else {
                          alert('Failed to generate resume. Please try again.');
                        }
                      } catch (err: any) {
                        alert(`Failed to generate PDF: ${err?.message || 'Unknown error'}`);
                      }
                    }}
                    className="p-1.5 rounded-full border-2 border-gray-500 text-gray-600 hover:bg-gray-100 transition-colors px-4 flex items-center justify-center"
                    title="Download PDF"
                  >
                    <IconDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResumeListPage;
