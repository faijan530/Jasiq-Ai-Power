import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllResumesForAdmin, getResumeVersions, getResumePdf, AdminResumeItem } from "../../../modules/admin/services/admin.api";
import { FileText, User, Calendar, ArrowLeft, Eye, Loader2, Download, History, File } from "lucide-react";

interface ResumeVersion {
  id: string;
  versionNumber: number;
  resumeJson: any;
  createdAt: string;
}

export const AdminResumeDetailPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<AdminResumeItem | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [pdfData, setPdfData] = useState<{ html: string; pdfUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "versions" | "pdf">("details");

  useEffect(() => {
    if (resumeId) {
      fetchResumeData();
    }
  }, [resumeId]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      // Fetch all resumes and find the one we need
      const resumesResponse = await getAllResumesForAdmin();
      if (resumesResponse.success) {
        const found = resumesResponse.data.find((r) => r.id === resumeId);
        if (found) {
          setResume(found);
        } else {
          setError("Resume not found");
          return;
        }
      }

      // Fetch versions
      const versionsResponse = await getResumeVersions(resumeId!);
      if (versionsResponse.success) {
        setVersions(versionsResponse.data);
      }

      // Fetch PDF
      const pdfResponse = await getResumePdf(resumeId!);
      if (pdfResponse.success) {
        setPdfData(pdfResponse.data);
      }
    } catch {
      setError("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error || "Resume not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/resumes")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to All Resumes
      </button>

      {/* Resume Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{resume.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="font-medium text-gray-700">{resume.userName}</span>
                <span className="text-gray-400">({resume.userEmail})</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(resume.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <History className="w-4 h-4" />
                <span>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "details", label: "Resume Details", icon: Eye },
          { id: "versions", label: `Versions (${versions.length})`, icon: History },
          { id: "pdf", label: "PDF Preview", icon: File },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === "details" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Resume Content</h3>
            {resume.latestVersion?.resumeJson ? (
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(resume.latestVersion.resumeJson, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">No resume content available</p>
            )}
          </div>
        )}

        {activeTab === "versions" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Version History</h3>
            {versions.length === 0 ? (
              <p className="text-gray-500">No versions found</p>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <History className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Version {version.versionNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pdf" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">PDF Preview</h3>
              {pdfData?.pdfUrl && (
                <a
                  href={pdfData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              )}
            </div>
            {pdfData?.html ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={pdfData.html}
                  className="w-full h-[600px]"
                  sandbox="allow-same-origin"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <p className="text-gray-500">PDF preview not available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResumeDetailPage;
