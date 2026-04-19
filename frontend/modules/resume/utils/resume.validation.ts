import type { CanonicalResumeJson } from "../types/resume.dto";

export type FieldErrorMap = Record<string, string>;

const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

const normalizeSkillName = (name: string): string => name.trim().toLowerCase();

export const validateResumeJson = (json: CanonicalResumeJson): FieldErrorMap => {
  const errors: FieldErrorMap = {};

  const email = json.basics?.email ?? "";
  if (!isValidEmail(email)) {
    errors["basics.email"] = "Invalid email format";
  }

  const skills = Array.isArray(json.skills) ? json.skills : [];
  if (skills.length < 1) {
    errors["skills"] = "At least 1 skill is required";
  }

  const normalized = skills.map((s) => normalizeSkillName(s.name));
  const duplicates = new Map<string, number[]>();
  normalized.forEach((n, idx) => {
    if (!n) return;
    const list = duplicates.get(n) ?? [];
    list.push(idx);
    duplicates.set(n, list);
  });

  for (const [_, idxs] of duplicates.entries()) {
    if (idxs.length <= 1) continue;
    for (const i of idxs) {
      errors[`skills.${i}.name`] = "Duplicate skill name";
    }
  }

  const projects = Array.isArray(json.projects) ? json.projects : [];
  projects.forEach((p, i) => {
    if (!p.title || !p.title.trim()) {
      errors[`projects.${i}.title`] = "Project title is required";
    }
    if (!p.description || !p.description.trim()) {
      errors[`projects.${i}.description`] = "Project description is required";
    }
  });

  const experience = Array.isArray(json.experience) ? json.experience : [];
  experience.forEach((x, i) => {
    const responsibilities = Array.isArray(x.responsibilities) ? x.responsibilities : [];
    if (responsibilities.length < 1 || responsibilities.every((r) => !r || !r.trim())) {
      errors[`experience.${i}.responsibilities`] = "Experience responsibilities are required";
    }
  });

  return errors;
};

export const hasErrors = (errors: FieldErrorMap): boolean => Object.keys(errors).length > 0;

