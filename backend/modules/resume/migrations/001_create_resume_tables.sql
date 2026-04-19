CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID PRIMARY KEY,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  resume_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resume_user ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_tenant ON resumes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_resume_version ON resume_versions(resume_id);

