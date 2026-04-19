import { useMemo } from "react";
import { useResumeStore } from "../store/resume.store";
import { validateResumeJson, hasErrors } from "../utils/resume.validation";

export const useResumeEditor = () => {
  const resume = useResumeStore((s) => s.resume);
  const resumeJson = useResumeStore((s) => s.resumeJson);
  const updateField = useResumeStore((s) => s.updateField);

  const errors = useMemo(() => validateResumeJson(resumeJson), [resumeJson]);
  const invalid = hasErrors(errors);

  return {
    resume,
    resumeJson,
    updateField,
    errors,
    hasErrors: invalid,
  };
};

