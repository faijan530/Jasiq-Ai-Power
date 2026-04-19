export interface CanonicalResumeJson {
  schemaVersion: number;
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  skills: { name: string; level: string }[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    link: string;
  }[];
  education: {
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }[];
  achievements: string[];
  links: { label: string; url: string }[];
}

export interface CreateResumeDto {
  title: string;
  resumeJson: CanonicalResumeJson;
}

