// Inline SVG Icons
const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FileTextIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const GraduationCapIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6.818c0 .883.64 1.675 1.515 1.84 1.588.305 3.227.534 4.907.634m-9-8.672V20.5c0 .883-.64 1.675-1.515 1.84A22.083 22.083 0 012.75 21.186" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WrenchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FolderGitIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-4-4H5a2 2 0 00-2 2z" />
  </svg>
);

const LinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const WarningIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

type SectionKey =
  | "personal"
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "links";

interface ResumeSectionsSidebarProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  sectionErrors?: Record<SectionKey, boolean>;
  sectionCompletion?: Record<SectionKey, boolean>;
}

const sections: Array<{ key: SectionKey; label: string; icon: React.FC<{ className?: string }> }> = [
  { key: "personal", label: "Personal Info", icon: UserIcon },
  { key: "summary", label: "Summary", icon: FileTextIcon },
  { key: "education", label: "Education", icon: GraduationCapIcon },
  { key: "experience", label: "Experience", icon: BriefcaseIcon },
  { key: "skills", label: "Skills", icon: WrenchIcon },
  { key: "projects", label: "Projects", icon: FolderGitIcon },
  { key: "links", label: "Links", icon: LinkIcon },
];

export function ResumeSectionsSidebar({
  activeSection,
  onSectionChange,
  sectionErrors = {} as Record<SectionKey, boolean>,
  sectionCompletion = {} as Record<SectionKey, boolean>,
}: ResumeSectionsSidebarProps) {
  const completedCount = Object.values(sectionCompletion).filter(Boolean).length;
  const progress = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-2 h-full flex flex-col">
      <h3 className="font-semibold text-gray-700 mb-2 px-2">
        Resume Sections
      </h3>

      {/* Progress Bar */}
      <div className="px-2 mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{completedCount}/{sections.length} completed</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.key;
          const hasError = sectionErrors[section.key];
          const isComplete = sectionCompletion[section.key];
          const Icon = section.icon;

          return (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              className={[
                "w-full flex justify-between items-center px-3 py-3 rounded-lg transition-all duration-200 group text-sm hover:shadow-sm hover:scale-[1.01]",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                hasError && !isActive ? "ring-1 ring-red-300 bg-red-50/50" : "",
                isComplete && !isActive ? "bg-green-50/50" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <Icon className={["w-4 h-4", isActive ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500"].join(" ")} />
                <span className="text-left">{section.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Status Indicator */}
                {isComplete && !isActive && !hasError && (
                  <span className="text-green-500">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                )}
                {hasError && !isActive && (
                  <span className="text-red-400">
                    <WarningIcon className="w-4 h-4" />
                  </span>
                )}
                <span className={["text-gray-400 transition-transform duration-200", isActive ? "rotate-90 text-blue-500" : ""].join(" ")}>
                  <ChevronRightIcon className="w-4 h-4" />
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 text-center">
          {sections.length} sections available
        </div>
      </div>
    </div>
  );
}
