import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { MobileSidebar } from "../components/layout/MobileSidebar";
export { Sidebar, Topbar };

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F0F4F8]">
      {/* LEFT SIDEBAR - Desktop only */}
      <div className="hidden lg:block bg-white shadow-sm z-10 relative">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-20">
          <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:max-w-7xl lg:mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
