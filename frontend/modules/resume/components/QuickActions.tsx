interface QuickActionsProps {
  onAddProject?: () => void;
  onImproveSummary?: () => void;
  onSuggestSkills?: () => void;
  onAddExperience?: () => void;
  onAiImprove?: () => void;
}

export function QuickActions({
  onAddProject,
  onImproveSummary,
  onSuggestSkills,
  onAddExperience,
  onAiImprove,
}: QuickActionsProps) {
  const actions = [
    {
      label: "Add Project",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      ),
      onClick: onAddProject,
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
    },
    {
      label: "Improve Summary",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      ),
      onClick: onImproveSummary,
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
    },
    {
      label: "Suggest Skills",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
      onClick: onSuggestSkills,
      color: "bg-amber-50 hover:bg-amber-100 text-amber-700",
    },
    {
      label: "Add Experience",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      onClick: onAddExperience,
      color: "bg-green-50 hover:bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Quick actions to enhance your resume:</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={!action.onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
