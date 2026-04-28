import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { FileText, BarChart3, Target, LogOut, Shield, X, Grid, CheckCircle2, Briefcase } from "lucide-react";

const getMenu = (isAdmin: boolean) => [
  { name: "Resume Builder", path: "/app/resume", icon: FileText },
  { name: "ATS Analyzer", path: "/app/ats", icon: BarChart3 },
  { name: "JD Match", path: "/app/jd-match", icon: Target },
  { name: "Job Engine", path: "/app/jobs", icon: Briefcase },
  ...(isAdmin ? [{ name: "Admin Panel", path: "/admin", icon: Shield }] : []),
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const menu = getMenu(isAdmin);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[260px] bg-[#1a56db] text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Abstract Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="p-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Grid className="w-7 h-7 text-white" />
            <span className="text-[22px] font-bold tracking-wide text-white">JASIQ</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1.5 relative z-10 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-white/10 text-white border-l-[3px] border-white pl-[13px] shadow-sm"
                      : "text-blue-100 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent"
                  }`
                }
              >
                <Icon className="w-5 h-5 opacity-90" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* USER PROFILE */}
        <div className="p-5 mt-auto relative z-10">
          <div className="bg-gradient-to-b from-white/10 to-transparent rounded-2xl p-5 border border-white/10 text-center relative overflow-hidden">
            {/* Decorative small stars/circles inside user card */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full" />
            <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-white/20 rounded-full" />
            <div className="absolute bottom-6 right-3 w-1 h-1 bg-white/30 rounded-full" />

            <div className="relative inline-block mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Student")}&background=fff&color=1a56db`}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-white/20 mx-auto shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#2051d9] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-[15px] font-semibold text-white truncate tracking-wide">{user?.name || "Student"}</div>
            <div className="text-[11px] text-blue-200 mt-1 mb-5 leading-relaxed font-medium uppercase tracking-wider">
              {user?.role || "STUDENT"}
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-500/40 hover:bg-blue-500/60 py-2.5 rounded-xl transition-colors border border-white/20 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
