import { create } from "zustand";
import type {
  ApiEnvelope,
  CanonicalResumeJson,
  ResumeJsonModel,
  ResumeResponseDto,
  ResumeVersionDto,
} from "../types/resume.dto";
import type { ResumeModel } from "../types/resume.model";
import { createEmptyResumeJson } from "../types/resume.model";
import { getResume, getResumeVersions } from "../services/resume.api";

export type ResumeStoreError = string;

export interface ResumeStoreState {
  resume: ResumeModel | null;
  resumeJson: ResumeJsonModel;
  currentVersion: ResumeVersionDto | null;
  loading: boolean;
  error: ResumeStoreError | null;
  selectedTemplate: string;

  setResume: (resume: ResumeModel | null, currentVersion?: ResumeVersionDto | null) => void;
  updateField: (path: string, value: unknown) => void;
  setTemplate: (template: string) => void;
  resetResume: () => void;
  hydrateFromAPI: (resumeId: string) => Promise<void>;
}

const setNestedValue = (obj: any, path: string, value: unknown): any => {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return obj;

  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor: any = next;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const existing = cursor[key];
    cursor[key] = Array.isArray(existing) ? [...existing] : existing ? { ...existing } : {};
    cursor = cursor[key];
  }

  cursor[parts[parts.length - 1]] = value;
  return next;
};

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  resume: null,
  resumeJson: createEmptyResumeJson(),
  currentVersion: null,
  loading: false,
  error: null,
  selectedTemplate: "modern",

  setTemplate: (template) => set(() => ({ selectedTemplate: template })),

  setResume: (resume, currentVersion = null) =>
    set(() => ({
      resume,
      currentVersion,
      resumeJson: (currentVersion?.resumeJson ?? resume?.latestVersion?.resumeJson ?? createEmptyResumeJson()) as CanonicalResumeJson,
      error: null,
    })),

  updateField: (path, value) => {
    const prev = get().resumeJson;
    const updated = setNestedValue(prev, path, value);
    set(() => ({ resumeJson: updated }));
  },

  resetResume: () =>
    set(() => ({
      resume: null,
      resumeJson: createEmptyResumeJson(),
      currentVersion: null,
      loading: false,
      error: null,
    })),

  hydrateFromAPI: async (resumeId) => {
    set(() => ({ loading: true, error: null }));
    try {
      // Parallel API calls - 2x faster loading
      const [resumeEnvelope, versionsEnvelope] = await Promise.all([
        getResume(resumeId),
        getResumeVersions(resumeId),
      ]);

      const resume = resumeEnvelope.data;
      const versions = versionsEnvelope.data;

      // Prefer latestVersion (if backend provided), otherwise compute from versions list.
      const latest =
        resume.latestVersion ??
        versions.sort((a, b) => b.versionNumber - a.versionNumber)[0] ??
        null;

      set(() => ({
        resume,
        currentVersion: latest,
        resumeJson: (latest?.resumeJson ?? resume.latestVersion?.resumeJson ?? createEmptyResumeJson()) as CanonicalResumeJson,
        loading: false,
        error: null,
      }));
    } catch (e: any) {
      set(() => ({
        loading: false,
        error: e?.message ? String(e.message) : "Failed to hydrate resume",
      }));
      throw e;
    }
  },
}));

