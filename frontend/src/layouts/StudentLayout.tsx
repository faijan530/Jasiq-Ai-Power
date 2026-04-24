import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
export { Sidebar, Topbar };

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
