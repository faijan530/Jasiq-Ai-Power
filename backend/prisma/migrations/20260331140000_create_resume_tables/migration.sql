-- Migration: create resumes and resume_versions tables for Resume module

CREATE TABLE IF NOT EXISTS "resumes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "resume_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "resume_id" UUID NOT NULL,
  "version_number" INT NOT NULL,
  "resume_json" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "resume_versions_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS "idx_resume_user" ON "resumes"("user_id");
CREATE INDEX IF NOT EXISTS "idx_resume_tenant" ON "resumes"("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_resume_version" ON "resume_versions"("resume_id");

