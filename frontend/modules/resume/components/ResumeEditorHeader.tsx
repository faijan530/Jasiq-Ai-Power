import type { CanonicalResumeJson } from "../types/resume.dto";

interface ResumeEditorHeaderProps {
  resumeJson: CanonicalResumeJson;
  resumeTitle: string;
  setResumeTitle: (title: string) => void;
  canEdit: boolean;
  onSave: () => void;
  isSaving?: boolean;
  onExportPdf?: () => void;
  onAiImprove?: () => void;
  isAiImproving?: boolean;
}

export function ResumeEditorHeader({
  resumeJson,
  resumeTitle,
  setResumeTitle,
  canEdit,
  onSave,
  isSaving,
  onExportPdf,
  onAiImprove,
  isAiImproving,
}: ResumeEditorHeaderProps) {
  // Get initials from name
  const initials = resumeJson.basics.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "ME";

  // Get role from summary or default
  const role = resumeJson.basics.summary?.split(" ").slice(0, 3).join(" ") || 
    resumeJson.experience[0]?.role || 
    "Professional";

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Avatar + Title + Role */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full font-bold text-lg shadow-md flex-shrink-0">
            {initials}
          </div>
          
          {/* Title + Role */}
          <div className="flex-1 min-w-0">
            {canEdit ? (
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full text-lg font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors px-0 py-0.5"
                placeholder="Resume Title"
              />
            ) : (
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {resumeTitle || "Untitled Resume"}
              </h1>
            )}
            <p className="text-sm text-slate-500 truncate">{role}</p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* AI Improve Button */}
          <button
            onClick={onAiImprove}
            disabled={isAiImproving || !canEdit}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isAiImproving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Improving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                AI Improve
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={!canEdit || isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Save
              </>
            )}
          </button>

          {/* Export PDF Button */}
          <button
            onClick={onExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
