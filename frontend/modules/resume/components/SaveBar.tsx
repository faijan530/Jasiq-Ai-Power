import type { ReactNode } from "react";

interface SaveBarProps {
  canEdit: boolean;
  onSave: () => void;
  isSaving?: boolean;
  disabledReason?: string;
  rightSlot?: ReactNode;
  lastSavedAt?: Date | null;
}

export function SaveBar({
  canEdit,
  onSave,
  isSaving,
  disabledReason,
  rightSlot,
  lastSavedAt,
}: SaveBarProps) {
  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const now = new Date();
    const diff = now.getTime() - lastSavedAt.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return lastSavedAt.toLocaleDateString();
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 shadow-lg rounded-t-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-slate-900">Save Resume</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            {isSaving ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Last saved: {getLastSavedText()}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rightSlot}
          <button
            type="button"
            disabled={!canEdit || isSaving}
            onClick={onSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>
      </div>
    </div>
  );
}

