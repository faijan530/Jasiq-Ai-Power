import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useResumeStore } from "../store/resume.store";
import { getResume, getResumeVersions, renderResumePdf, updateResume } from "../services/resume.api";
import type { CanonicalResumeJson, ResumeResponseDto, ResumeVersionDto } from "../types/resume.dto";
import { ResumeEditor } from "../components/ResumeEditor";
import { EmptyResumeState } from "../components/EmptyResumeState";
import { logEvent } from "../utils/logEvent";
import { sanitizeCanonicalResumeJson } from "../utils/sanitize";

interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
}

export function ResumeEditorPage({ currentUser }: { currentUser: CurrentUser }) {
  const { resumeId } = useParams<{ resumeId: string }>();
  const queryClient = useQueryClient();
  const isStudent = currentUser.role === "STUDENT";

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const hydrateFromAPI = useResumeStore((s) => s.hydrateFromAPI);
  const resume = useResumeStore((s) => s.resume);
  const currentVersion = useResumeStore((s) => s.currentVersion);

  const { data: resumeQuery, isLoading: isResumeLoading, isError, error } = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    staleTime: 30000, // Cache for 30 seconds
    queryFn: async () => {
      const envelope = await getResume(resumeId!);
      const data = envelope.data;
      // Skip tenant check if user tenantId is missing or matches resume tenantId
      if (currentUser.tenantId && data.tenantId !== currentUser.tenantId) {
        throw new Error("Tenant mismatch");
      }
      return data;
    },
  });

  const { data: versionsQuery } = useQuery({
    queryKey: ["resume_versions", resumeId],
    enabled: !!resumeId,
    staleTime: 30000, // Cache for 30 seconds
    queryFn: async () => {
      const envelope = await getResumeVersions(resumeId!);
      return envelope.data;
    },
  });

  // Sync React Query data to Zustand store (no double fetching)
  useEffect(() => {
    if (!resumeId || !resumeQuery) return;
    
    // Use cached data from React Query instead of refetching
    const latestVersion = versionsQuery?.sort((a, b) => b.versionNumber - a.versionNumber)[0];
    useResumeStore.setState({
      resume: resumeQuery as any,
      currentVersion: latestVersion || null,
      resumeJson: (latestVersion?.resumeJson ?? resumeQuery.latestVersion?.resumeJson ?? {}) as CanonicalResumeJson,
      loading: false,
      error: null,
    });
  }, [resumeId, resumeQuery, versionsQuery]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { title: string; resumeJson: CanonicalResumeJson }) => {
      if (!resumeId) throw new Error("Missing resumeId");
      const safe = sanitizeCanonicalResumeJson(payload.resumeJson);
      const envelope = await updateResume(resumeId, { title: payload.title, resumeJson: safe });
      return envelope.data;
    },
    onSuccess: (data) => {
      const id = resumeId;
      logEvent("resume_updated", { resumeId: data.id });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["resume", id] });
        queryClient.invalidateQueries({ queryKey: ["resume_versions", id] });
      }
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (id: string) => {
      const envelope = await renderResumePdf(id);
      return envelope.data;
    },
    onSuccess: (data) => {
      setPdfUrl(data.pdfUrl);
      logEvent("resume_pdf_generated", { pdfUrl: data.pdfUrl });
    },
  });

  if (!resumeId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mt-10 text-center text-gray-500">
          <p>No resume loaded</p>
          <Link to="/app/resume" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
            Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  if (!isStudent && typeof window !== "undefined" && window.location.pathname.includes("/edit")) {
    return <Navigate to={`/app/resume/${resumeId}`} replace />;
  }

  // Show loading while data is being fetched
  if (isResumeLoading || (!resumeQuery && !isError)) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-7xl">
          {/* Skeleton Header */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-40 bg-purple-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
          {/* Skeleton Content */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <div className="bg-white rounded-xl p-4 shadow-md h-96">
                <div className="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <div className="bg-white rounded-xl p-4 shadow-md h-96 space-y-4">
                <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="bg-white rounded-xl p-4 shadow-md h-96 space-y-3">
                <div className="h-32 bg-purple-50 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resumeQuery && resumeQuery.tenantId !== currentUser.tenantId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-7xl rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800 shadow-md">
          Tenant mismatch. You are not allowed to view this resume.
        </div>
      </div>
    );
  }

  const handleSave = async (payload: { title: string; resumeJson: CanonicalResumeJson }) => {
    if (!isStudent) {
      return;
    }
    try {
      await updateMutation.mutateAsync(payload);
    } catch {
      // Error handled by mutation
    }
  };

  const effectiveResume: ResumeResponseDto | null = (resume as ResumeResponseDto | null) ?? resumeQuery ?? null;
  const versions: ResumeVersionDto[] = versionsQuery ?? [];

  // Show loading if we don't have resume data yet
  if (!effectiveResume) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-slate-600">Loading resume...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {effectiveResume ? (
        <ResumeEditor
          canEdit={isStudent}
          onSave={handleSave}
          isSaving={updateMutation.isPending}
          disabledReason={!isStudent ? "Only students can edit resumes." : undefined}
          pdfUrl={pdfUrl}
          versions={versions}
          currentVersionId={currentVersion?.id ?? null}
          onVersionSelect={(versionId) => {
            logEvent("resume_updated", { action: "version_selected", versionId, resumeId: effectiveResume?.id });
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <EmptyResumeState />
          </div>
        </div>
      )}
    </div>
  );
}
