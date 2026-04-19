import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getResume, renderResumePdf } from "../services/resume.api";
import { PdfPreviewCard } from "../components/PdfPreviewCard";
import { logEvent } from "../utils/logEvent";

interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
}

export function ResumePdfViewerPage({ currentUser }: { currentUser: CurrentUser }) {
  const { resumeId } = useParams<{ resumeId: string }>();

  const { data: resumeData, isLoading: isResumeLoading, error: resumeError } = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResume(resumeId!);
      return envelope.data;
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (id: string) => {
      const envelope = await renderResumePdf(id);
      return envelope.data;
    },
    onSuccess: (data) => {
      logEvent("resume_pdf_generated", { pdfUrl: data.pdfUrl });
    },
  });

  if (isResumeLoading) {
    return <div className="p-6 text-sm text-slate-600 dark:text-slate-200">Loading resume...</div>;
  }

  if (resumeError || !resumeData || resumeData.tenantId !== currentUser.tenantId) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Tenant mismatch or resume not found.
        </div>
      </div>
    );
  }

  const pdfUrl = (pdfMutation.data && pdfMutation.data.pdfUrl) || "";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resume PDF</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Generate and preview the latest PDF export of your resume.
          </p>
        </div>
        <button
          type="button"
          onClick={() => pdfMutation.mutate(resumeData.id)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pdfMutation.isLoading}
        >
          {pdfMutation.isLoading ? "Generating..." : "Generate PDF"}
        </button>
      </div>

      <PdfPreviewCard pdfUrl={pdfUrl || null} />
    </div>
  );
}

