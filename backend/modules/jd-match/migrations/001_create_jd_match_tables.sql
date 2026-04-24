-- Migration: create jd_match_reports table for JD Match module

CREATE TABLE IF NOT EXISTS "jd_match_reports" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "resume_id" UUID NOT NULL,
  "version_id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "job_title" VARCHAR(255),
  "jd_text" TEXT NOT NULL,
  "overall_match" INT NOT NULL DEFAULT 0,
  "skills_match" JSONB NOT NULL DEFAULT '{}',
  "keyword_match" JSONB NOT NULL DEFAULT '{}',
  "experience_match" JSONB NOT NULL DEFAULT '{}',
  "role_fit_score" INT NOT NULL DEFAULT 0,
  "suggestions" JSONB NOT NULL DEFAULT '[]',
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_jd_match_resume" ON "jd_match_reports"("resume_id");
CREATE INDEX IF NOT EXISTS "idx_jd_match_version" ON "jd_match_reports"("version_id");
CREATE INDEX IF NOT EXISTS "idx_jd_match_tenant" ON "jd_match_reports"("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_jd_match_created" ON "jd_match_reports"("created_at" DESC);
