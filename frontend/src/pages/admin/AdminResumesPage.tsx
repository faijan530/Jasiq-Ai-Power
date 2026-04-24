import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllResumesForAdmin, AdminResumeItem } from "../../../modules/admin/services/admin.api";
import { FileText, User, Calendar, Eye, ChevronRight, Search, Loader2, TrendingUp, Clock, Filter, ArrowUpDown } from "lucide-react";

export const AdminResumesPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<AdminResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await getAllResumesForAdmin();
      if (response.success) {
        setResumes(response.data);
      }
    } catch (err) {
      setError("Failed to fetch resumes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const uniqueStudents = new Set(resumes.map(r => r.userId)).size;
  const todayResumes = resumes.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.createdAt).toDateString() === today;
  }).length;

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter((resume) => {
      const query = searchQuery.toLowerCase();
      return (
        resume.title.toLowerCase().includes(query) ||
        resume.userName?.toLowerCase().includes(query) ||
        resume.userEmail?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === "desc" 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
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
          <h1 className="text-2xl font-bold text-gray-800">All Student Resumes</h1>
          <p className="text-gray-500 mt-1">
            View all resumes created by students (Read-only)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Total: {resumes.length} resumes
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Resumes</p>
              <p className="text-2xl font-bold text-blue-900">{resumes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Unique Students</p>
              <p className="text-2xl font-bold text-green-900">{uniqueStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Created Today</p>
              <p className="text-2xl font-bold text-purple-900">{todayResumes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, student name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            title={sortOrder === "desc" ? "Descending" : "Ascending"}
          >
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {filteredResumes.length} of {resumes.length} resumes</span>
        {searchQuery && (
          <span className="text-blue-600">Filtered by: "{searchQuery}"</span>
        )}
      </div>

      {/* Resumes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredResumes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No resumes found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="p-6 hover:bg-gray-50 transition-all cursor-pointer group"
                onClick={() => navigate(`/admin/resumes/${resume.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                        {resume.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="font-medium text-gray-700">{resume.userName || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <span>{resume.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {resume.latestVersion && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            v{resume.latestVersion.versionNumber}
                          </span>
                          <span className="text-sm text-gray-400">
                            Updated {new Date(resume.latestVersion.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                    <Eye className="w-5 h-5" />
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResumesPage;
