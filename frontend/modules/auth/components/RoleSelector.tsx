import { UserRole } from "../store/auth.store";

interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Only STUDENT role is available for self-registration
// Other roles (ADMIN, PLACEMENT_OFFICER, RECRUITER) are created via admin panel or seed script
const roles: RoleOption[] = [
  {
    value: "STUDENT",
    label: "Student",
    icon: "🎓",
    description: "Create resumes and apply for jobs",
    color: "bg-blue-500",
  },
];

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {roles.map((role) => (
        <div
          key={role.value}
          className="flex items-center p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-left"
        >
          <div
            className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center text-lg mr-3 shrink-0`}
          >
            {role.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 text-sm">
              {role.label}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {role.description}
            </div>
          </div>
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      ))}
      <p className="text-xs text-slate-400 mt-2 text-center">
        Only Student accounts can be created. Contact admin for other roles.
      </p>
    </div>
  );
};
