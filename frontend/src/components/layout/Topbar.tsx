import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

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
    return "Student Panel";
  };

  return (
    <div className="bg-white px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name || "Student"}</span>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Student")}&background=0D8ABC&color=fff&size=40`}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
};

export default Topbar;
