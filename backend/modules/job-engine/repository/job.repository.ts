import { PrismaClient } from '@prisma/client';
import { Job } from '../domain/entities/job.entity';
import { JobMapper } from '../mappers/job.mapper';
import { SearchJobDto } from '../dto/search-job.dto';
import { prisma as sharedPrisma } from '../../../lib/prisma';

export class JobRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? sharedPrisma;
  }

  async save(job: Job): Promise<Job> {
    const data = {
      id: job.id.value,
      tenant_id: job.tenantId ?? null,
      title: job.title,
      company: job.company,
      location: job.location ?? null,
      employment_type: job.employmentType ?? null,
      skills_required: job.skillsRequired ?? [],
      min_experience: job.minExperience ?? null,
      max_experience: job.maxExperience ?? null,
      jd_text: job.jdText,
      source: job.source ?? null,
      apply_link: job.applyLink ?? null,
      posted_at: job.postedAt ?? null,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    };

    const rows = await this.prisma.$queryRaw<any[]>`
      INSERT INTO jobs (
        id, tenant_id, title, company, location, employment_type, 
        skills_required, min_experience, max_experience, jd_text, 
        source, apply_link, posted_at, created_at, updated_at
      )
      VALUES (
        ${data.id}::uuid, 
        CAST(${data.tenant_id} AS UUID), 
        ${data.title}, ${data.company}, ${data.location}, ${data.employment_type}, 
        ${JSON.stringify(data.skills_required)}::jsonb, 
        ${data.min_experience}, ${data.max_experience}, ${data.jd_text}, 
        ${data.source}, ${data.apply_link}, ${data.posted_at}, ${data.created_at}, ${data.updated_at}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        location = EXCLUDED.location,
        employment_type = EXCLUDED.employment_type,
        skills_required = EXCLUDED.skills_required,
        min_experience = EXCLUDED.min_experience,
        max_experience = EXCLUDED.max_experience,
        jd_text = EXCLUDED.jd_text,
        source = EXCLUDED.source,
        apply_link = EXCLUDED.apply_link,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;
    return JobMapper.toDomain(rows[0]);
  }

  async findById(id: string): Promise<Job | null> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM jobs WHERE id = ${id}::uuid
    `;
    return rows.length ? JobMapper.toDomain(rows[0]) : null;
  }

  async findByTenantId(tenantId: string): Promise<Job[]> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM jobs WHERE tenant_id = ${tenantId}::uuid ORDER BY created_at DESC
    `;
    return rows.map(JobMapper.toDomain);
  }

  async search(filters: SearchJobDto): Promise<Job[]> {
    let conditions = [];
    if (filters.query) {
      conditions.push(`to_tsvector(title || ' ' || jd_text) @@ plainto_tsquery('${filters.query.replace(/'/g, "''")}')`);
    }
    if (filters.location) {
      conditions.push(`location ILIKE '%${filters.location.replace(/'/g, "''")}%'`);
    }
    if (filters.type) {
      conditions.push(`employment_type = '${filters.type.replace(/'/g, "''")}'`);
    }
    if (filters.tenantId) {
      conditions.push(`(tenant_id = '${filters.tenantId.replace(/'/g, "''")}'::uuid OR tenant_id IS NULL)`);
    }
    
    const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    
    const query = `SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC LIMIT 100`;
    const rows = await this.prisma.$queryRawUnsafe<any[]>(query);
    return rows.map(JobMapper.toDomain);
  }

  async list(filters: SearchJobDto): Promise<Job[]> {
    return this.search(filters);
  }
}
