import type { CanonicalResumeJson } from "../types/resume.dto";

interface ResumeHeaderProps {
  resumeJson: CanonicalResumeJson;
  resumeTitle: string;
  score: number;
  scoreMessage: { emoji: string; text: string; color: string };
  isAnalyzing: boolean;
}

export function ResumeHeader({
  resumeJson,
  resumeTitle,
  score,
  scoreMessage,
  isAnalyzing,
}: ResumeHeaderProps) {
  // Get role from first experience or summary
  const role = resumeJson.experience?.[0]?.role || 
    resumeJson.basics.summary?.split(" ").slice(0, 3).join(" ") || 
    "Professional";

  // Dynamic calculations instead of hardcoded values
  const optimizationLevel = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";
  
  // Calculate completion percentage based on filled sections
  const sections = ['basics.name', 'basics.email', 'basics.summary', 'experience', 'education', 'skills', 'projects'];
  const filledSections = sections.filter(sec => {
    if (sec.startsWith('basics.')) return !!(resumeJson.basics as any)[sec.split('.')[1]];
    return (resumeJson as any)[sec] && (resumeJson as any)[sec].length > 0;
  });
  const completionPercentage = Math.round((filledSections.length / sections.length) * 100);

  return (
    <div className="space-y-4">
      {/* Top Stats Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Main Score Pill */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm flex-1 min-w-[200px]">
          <div className="text-3xl font-bold">{score}%</div>
          <div className="flex-1">
            <div className="text-[13px] font-bold tracking-wide uppercase opacity-90">Resume Score</div>
            <div className="text-[11px] opacity-75 mt-0.5">{scoreMessage.text}</div>
          </div>
        </div>

        {/* Optimization Pill */}
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm min-w-[160px]">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <div className="text-[14px] font-bold">{optimizationLevel}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Optimization</div>
          </div>
        </div>

        {/* Match Pill */}
        <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm min-w-[140px]">
          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Complete</div>
          </div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar Area */}
          <div className="w-32 h-32 bg-[#e8f3ff] text-[#1a56db] flex items-center justify-center rounded-2xl font-bold text-4xl shadow-inner flex-shrink-0 relative overflow-hidden">
            {resumeJson.basics.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "ME"}
            
            {/* Optional badge */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          {/* Info Area */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
                  {resumeJson.basics.name || "Your Name"}
                </h3>
                <p className="text-[15px] font-semibold text-[#1a56db] mt-0.5">{role}</p>
              </div>
            </div>
            
            <p className="text-[13px] leading-relaxed text-gray-600 mt-2 line-clamp-3">
              {resumeJson.basics.summary || "Add a professional summary to highlight your skills and experience."}
            </p>
            
            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {resumeJson.basics.email && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {resumeJson.basics.email}
                </span>
              )}
              {resumeJson.basics.phone && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {resumeJson.basics.phone}
                </span>
              )}
              {resumeJson.basics.location && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {resumeJson.basics.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
