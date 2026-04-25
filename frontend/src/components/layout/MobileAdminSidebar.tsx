import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { FileText, Users, LogOut, Shield, BarChart3, X } from "lucide-react";

const adminMenu = [
  { name: "Dashboard", path: "/admin", icon: BarChart3, exact: true },
  { name: "All Resumes", path: "/admin/resumes", icon: FileText },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Manage Admins", path: "/admin/users", icon: Shield },
];

interface MobileAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAdminSidebar = ({ isOpen, onClose }: MobileAdminSidebarProps) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col">
        <div className="p-5 text-xl font-bold tracking-wide flex items-center justify-between">
          JASIQ
          <button onClick={onClose} className="p-1 hover:bg-blue-600 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-3 space-y-2 mt-4">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={
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

        <div className="p-4 border-t border-blue-600">
          <div className="text-sm font-medium">{user?.name || "Admin"}</div>
          <div className="text-xs text-blue-200 mb-3">{user?.role || "ADMIN"}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-300 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
