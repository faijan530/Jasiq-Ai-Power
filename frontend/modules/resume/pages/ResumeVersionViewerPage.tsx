import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResume, getResumeVersion } from "../services/resume.api";
import type { CanonicalResumeJson } from "../types/resume.dto";
import { ResumeCard } from "../components/ResumeCard";
import { ResumeJsonPreview } from "../components/ResumeJsonPreview";

interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
}

export function ResumeVersionViewerPage({ currentUser }: { currentUser: CurrentUser }) {
  const { resumeId, versionId } = useParams<{ resumeId: string; versionId: string }>();

  const { data: resumeData, isLoading: isResumeLoading } = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResume(resumeId!);
      return envelope.data;
    },
  });

  const { data: versionData, isLoading: isVersionLoading, error: versionError } = useQuery({
    queryKey: ["resume_version", resumeId, versionId],
    enabled: !!resumeId && !!versionId,
    queryFn: async () => {
      const envelope = await getResumeVersion(resumeId!, versionId!);
      return envelope.data;
    },
  });

  if (isResumeLoading || isVersionLoading) {
    return <div className="p-6 text-sm text-slate-600 dark:text-slate-200">Loading version...</div>;
  }

  if (versionError || !resumeData || resumeData.tenantId !== currentUser.tenantId) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Tenant mismatch or version not found.
        </div>
      </div>
    );
  }

  const json = (versionData?.resumeJson ?? resumeData.latestVersion?.resumeJson) as CanonicalResumeJson;

  return (
    <div className="p-6">
      <ResumeCard>
        <div className="rounded-2xl p-4 md:p-6">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {resumeData.title} — v{versionData?.versionNumber ?? resumeData.latestVersion?.versionNumber}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Immutable snapshot of your resume at this version.
            </p>
          </div>
          <ResumeJsonPreview resumeJson={json} />
        </div>
      </ResumeCard>
    </div>
  );
}

