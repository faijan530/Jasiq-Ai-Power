import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { useLocation } from "react-router-dom";

export const Topbar = () => {
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
    <div className="bg-white px-6 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || "Student"}</span>
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
