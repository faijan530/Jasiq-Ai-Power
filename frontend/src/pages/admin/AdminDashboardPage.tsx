import { useState, useEffect } from "react";
import { useAuthStore } from "../../../modules/auth/store/auth.store";
import { getAllResumesForAdmin, AdminResumeItem } from "../../../modules/admin/services/admin.api";
import { 
  Shield, 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  Calendar, 
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalStudents: number;
  totalResumes: number;
  recentResumes: AdminResumeItem[];
  topStudents: { userId: string; userName: string; userEmail: string; resumeCount: number }[];
}

export const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalResumes: 0,
    recentResumes: [],
    topStudents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllResumesForAdmin();
      
      if (response.success) {
        const resumes = response.data;
        
        // Calculate unique students
        const studentMap = new Map<string, { userId: string; userName: string; userEmail: string; resumeCount: number }>();
        
        resumes.forEach(resume => {
          if (studentMap.has(resume.userId)) {
            const student = studentMap.get(resume.userId)!;
            student.resumeCount++;
          } else {
            studentMap.set(resume.userId, {
              userId: resume.userId,
              userName: resume.userName || "Unknown",
              userEmail: resume.userEmail || "Unknown",
              resumeCount: 1
            });
          }
        });
        
        const students = Array.from(studentMap.values());
        const topStudents = students.sort((a, b) => b.resumeCount - a.resumeCount).slice(0, 5);
        
        // Get recent resumes (last 5)
        const recentResumes = [...resumes]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setStats({
          totalStudents: students.length,
          totalResumes: resumes.length,
          recentResumes,
          topStudents
        });
      }
    } catch {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || "Admin"}</h1>
            <p className="text-blue-100 mt-2 text-lg">
              College Admin Panel • View all student resumes and data
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Live</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/students" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all students <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Total Resumes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalResumes}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Live</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/resumes" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all resumes <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Avg Resumes Per Student */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Resumes/Student</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalStudents > 0 ? (stats.totalResumes / stats.totalStudents).toFixed(1) : "0"}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Read-only
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            Based on active student data
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Resumes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Recently Created Resumes</h2>
            </div>
            <Link to="/admin/resumes" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentResumes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No resumes found</p>
              </div>
            ) : (
              stats.recentResumes.map((resume) => (
                <Link
                  key={resume.id}
                  to={`/admin/resumes/${resume.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{resume.title}</p>
                    <p className="text-sm text-gray-500">{resume.userName} • {resume.userEmail}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Top Students by Resumes</h2>
            </div>
            <Link to="/admin/students" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.topStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No students found</p>
              </div>
            ) : (
              stats.topStudents.map((student, index) => (
                <div
                  key={student.userId}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{student.userName}</p>
                    <p className="text-sm text-gray-500 truncate">{student.userEmail}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {student.resumeCount} resumes
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/resumes" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-blue-800 text-lg mb-2">View All Resumes</h3>
                <p className="text-blue-600 text-sm">
                  Access and view all student resumes in the system. View resume content, versions, and PDF exports.
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Link>

        <Link to="/admin/students" className="group">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-green-800 text-lg mb-2">Student Directory</h3>
                <p className="text-green-600 text-sm">
                  View list of all registered students and their resume counts. Manage student data.
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Read-only Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-800">Read-only Access</h3>
          <p className="text-sm text-amber-700 mt-1">
            As a College Admin, you have read-only access to view all student data. 
            You cannot create, edit, or delete resumes. Contact the system administrator for changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
