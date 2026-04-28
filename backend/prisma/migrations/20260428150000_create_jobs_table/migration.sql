CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  tenant_id UUID NULL,
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  location VARCHAR,
  employment_type VARCHAR,
  skills_required JSONB,
  min_experience INT,
  max_experience INT,
  jd_text TEXT NOT NULL,
  source VARCHAR,
  apply_link VARCHAR,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN (skills_required);
