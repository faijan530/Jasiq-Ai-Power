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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Title Input */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Document Name</span>
          </div>
          {canEdit ? (
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-[#1a56db] focus:outline-none transition-colors px-0 py-0.5"
              placeholder="Enter Resume Title..."
            />
          ) : (
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {resumeTitle || "Untitled Resume"}
            </h1>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* AI Improve Button */}
          <button
            onClick={onAiImprove}
            disabled={isAiImproving || !canEdit}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a56db] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
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
