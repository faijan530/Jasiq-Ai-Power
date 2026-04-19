CREATE TABLE IF NOT EXISTS ats_reports (
  id UUID PRIMARY KEY,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES resume_versions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  section_scores JSONB NOT NULL,
  keyword_matches JSONB NOT NULL,
  issues JSONB NOT NULL,
  suggestions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ats_report_version ON ats_reports(version_id);
CREATE INDEX IF NOT EXISTS idx_ats_report_resume ON ats_reports(resume_id);
CREATE INDEX IF NOT EXISTS idx_ats_report_tenant ON ats_reports(tenant_id);
