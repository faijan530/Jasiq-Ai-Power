import { useState, useEffect } from "react";
import { getAllResumesForAdmin, AdminResumeItem } from "../../../modules/admin/services/admin.api";
import { Users, Mail, FileText, Loader2, Search } from "lucide-react";

interface StudentSummary {
  userId: string;
  userName: string;
  userEmail: string;
  resumeCount: number;
  lastUpdated: string;
}

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllResumesForAdmin();
      if (response.success) {
        // Group resumes by user
        const userMap = new Map<string, StudentSummary>();
        
        response.data.forEach((resume) => {
          const existing = userMap.get(resume.userId);
          if (existing) {
            existing.resumeCount++;
            if (new Date(resume.updatedAt) > new Date(existing.lastUpdated)) {
              existing.lastUpdated = resume.updatedAt;
            }
          } else {
            userMap.set(resume.userId, {
              userId: resume.userId,
              userName: resume.userName || "Unknown",
              userEmail: resume.userEmail || "Unknown",
              resumeCount: 1,
              lastUpdated: resume.updatedAt,
            });
          }
        });
        
        setStudents(Array.from(userMap.values()));
      }
    } catch {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.userName.toLowerCase().includes(query) ||
      student.userEmail.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
          <p className="text-gray-500 mt-1">
            View all registered students and their resume counts
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {students.length} students
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.userId}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {student.userName}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{student.userEmail}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-700">
                    {student.resumeCount} resume{student.resumeCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Last updated: {new Date(student.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No students found</p>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
