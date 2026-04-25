import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/auth.store";
import { FileText, Users, LogOut, Shield, BarChart3, Menu } from "lucide-react";
import { MobileAdminSidebar } from "../components/layout/MobileAdminSidebar";

const adminMenu = [
  { name: "Dashboard", path: "/admin", icon: BarChart3, exact: true },
  { name: "All Resumes", path: "/admin/resumes", icon: FileText },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Manage Admins", path: "/admin/users", icon: Shield },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDEBAR - Desktop only */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex-col">
        {/* LOGO */}
        <div className="p-5 text-xl font-bold tracking-wide">
          JASIQ
        </div>

        {/* MENU */}
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

        {/* USER */}
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

      {/* Mobile Sidebar */}
      <MobileAdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name || "Admin"}</span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=0D8ABC&color=fff&size=40`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
