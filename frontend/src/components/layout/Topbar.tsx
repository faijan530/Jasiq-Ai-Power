import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { useLocation } from "react-router-dom";
import { Menu, Search, Mail, Bell } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/resume")) return "Resume Builder";
    if (path.includes("/jd-match")) return "JD Match";
    if (path.includes("/ats")) return "ATS Analyzer";
    if (path.includes("/admin")) return "Admin Dashboard";
    return "Student Dashboard";
  };

  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 z-10 relative shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-bold text-gray-800">
          {getPageTitle()}
        </h1>
      </div>

      {/* SEARCH BAR (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 border-transparent bg-gray-50/80 text-gray-900 rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Icons */}
        <div className="hidden sm:flex items-center gap-5">
          <button className="relative text-gray-400 hover:text-blue-600 transition-colors">
            <Mail className="w-5 h-5" />
          </button>
          <button className="relative text-gray-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-gray-200">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Student")}&background=1a56db&color=fff&size=40`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
