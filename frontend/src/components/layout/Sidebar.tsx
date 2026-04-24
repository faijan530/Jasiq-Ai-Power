import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { FileText, BarChart3, Target, LogOut, Shield } from "lucide-react";

const getMenu = (isAdmin: boolean) => [
  { name: "Resume Builder", path: "/app/resume", icon: FileText },
  { name: "ATS Analyzer", path: "/app/ats", icon: BarChart3 },
  { name: "JD Match", path: "/app/jd-match", icon: Target },
  ...(isAdmin ? [{ name: "Admin Panel", path: "/admin", icon: Shield }] : []),
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const menu = getMenu(isAdmin);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col">
      {/* LOGO */}
      <div className="p-5 text-xl font-bold tracking-wide">
        JASIQ
      </div>

      {/* MENU */}
      <div className="flex-1 px-3 space-y-2 mt-4">
        {menu.map((item: { name: string; path: string; icon: React.ComponentType<{ className?: string }> }) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold shadow"
                    : "hover:bg-blue-600"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      {/* USER */}
      <div className="p-4 border-t border-blue-600">
        <div className="text-sm font-medium">{user?.name || "Student"}</div>
        <div className="text-xs text-blue-200 mb-3">{user?.role || "STUDENT"}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-300 hover:text-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
