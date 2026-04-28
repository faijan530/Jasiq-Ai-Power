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
      <div className="min-h-screen bg-[#F3F2EF] p-6">
        <div className="mt-10 text-center text-gray-500 bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
          <p>No resume loaded</p>
          <Link to="/app/resume" className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors">
            Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  if (!isStudent && typeof window !== "undefined" && window.location.pathname.includes("/edit")) {
    return <Navigate to={`/app/resume/${resumeId}`} replace />;
  }

  if (resumeQuery && resumeQuery.tenantId !== currentUser.tenantId) {
    return (
      <div className="min-h-screen bg-[#F3F2EF] p-6">
        <div className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800 shadow-sm text-center mt-10">
          Tenant mismatch. You are not allowed to view this resume.
        </div>
      </div>
    );
  }

  // Show loading while data is being fetched
  if (isResumeLoading || (!resumeQuery && !isError)) {
    return (
      <div className="min-h-screen bg-[#F3F2EF] p-6">
        <div className="mx-auto max-w-7xl">
          {/* Skeleton Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-40 bg-purple-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
          {/* Skeleton Body */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-96">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 min-h-[600px]">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
                <div className="space-y-6">
                  <div className="h-12 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-32 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-96">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle errors
  if (isError || !resumeQuery) {
    return (
      <div className="min-h-screen bg-[#F3F2EF] p-6">
        <div className="mx-auto max-w-3xl mt-10 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Resume</h2>
          <p className="text-red-600 mb-6">{error instanceof Error ? error.message : "Resume not found"}</p>
          <Link to="/app/resume" className="inline-flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
            Return to Dashboard
          </Link>
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
