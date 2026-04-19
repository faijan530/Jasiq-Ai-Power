import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResume, getResumeVersions } from "../services/resume.api";
import type { ResumeVersionDto } from "../types/resume.dto";
import { VersionTimeline } from "../components/VersionTimeline";

interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
}

export function ResumeVersionHistoryPage({ currentUser }: { currentUser: CurrentUser }) {
  const { resumeId } = useParams<{ resumeId: string }>();

  const { data: resumeData, isLoading: isResumeLoading, error: resumeError } = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResume(resumeId!);
      return envelope.data;
    },
  });

  const { data: versionsData, isLoading: isVersionsLoading, error: versionsError } = useQuery({
    queryKey: ["resume_versions", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResumeVersions(resumeId!);
      return envelope.data;
    },
  });

  if (isResumeLoading || isVersionsLoading) {
    return <div className="p-6 text-sm text-slate-600 dark:text-slate-200">Loading versions...</div>;
  }

  if (resumeError || versionsError) {
    return (
      <div className="p-6 text-sm text-red-600 dark:text-red-400">
        Failed to load resume versions.
      </div>
    );
  }

  if (!resumeData || resumeData.tenantId !== currentUser.tenantId) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Tenant mismatch. You are not allowed to view these versions.
        </div>
      </div>
    );
  }

  const versions = (versionsData ?? []) as ResumeVersionDto[];

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Version History</h1>
      <VersionTimeline
        versions={versions}
        currentVersionId={null}
        onSelect={() => {
          // Navigation is handled in the routing layer.
        }}
      />
    </div>
  );
}

