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
  const role = resumeJson.experience[0]?.role || 
    resumeJson.basics.summary?.split(" ").slice(0, 3).join(" ") || 
    "Professional";

  return (
    <div className="space-y-4">
      {/* Score Bar - ATS Readiness */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">ATS Readiness</span>
            </div>
            <p className={`text-sm ${scoreMessage.color} font-medium`}>
              {scoreMessage.emoji} {scoreMessage.text}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{score}%</div>
            <div className="text-xs opacity-70 flex items-center gap-1 justify-end">
              {isAnalyzing ? (
                <>
                  <span className="animate-pulse">●</span> Analyzing...
                </>
              ) : (
                "Updated just now"
              )}
            </div>
          </div>
        </div>
        {/* Progress Bar with animation */}
        <div className="w-full bg-blue-900/30 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-white to-blue-200 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Profile Card - Enhanced */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full font-bold text-xl shadow-md flex-shrink-0">
            {resumeJson.basics.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "ME"}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900">
              {resumeJson.basics.name || "Your Name"}
            </h3>
            <p className="text-sm text-slate-500 truncate">{role}</p>
            
            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              {resumeJson.basics.email && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {resumeJson.basics.email}
                </span>
              )}
              {resumeJson.basics.phone && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {resumeJson.basics.phone}
                </span>
              )}
              {resumeJson.basics.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
