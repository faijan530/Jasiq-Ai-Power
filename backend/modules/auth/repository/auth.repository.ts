import { PrismaClient, UserRole } from "@prisma/client";

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tenantId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string | null;
  createdAt: Date;
}

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(data: CreateUserData): Promise<UserResponse> {
    const result: any[] = await this.prisma.$queryRawUnsafe(
      `INSERT INTO users (id, email, password, name, role, tenant_id, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4::"UserRole", $5::uuid, true, NOW(), NOW())
       RETURNING id, email, name, role, tenant_id, created_at`,
      data.email,
      data.password,
      data.name,
      data.role,
      data.tenantId || null
    );

    return {
      id: result[0].id,
      email: result[0].email,
      name: result[0].name,
      role: result[0].role,
      tenantId: result[0].tenant_id,
      createdAt: result[0].created_at,
    };
  }

  async findByEmail(email: string): Promise<(UserResponse & { password: string }) | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, email, password, name, role, tenant_id, created_at
       FROM users
       WHERE email = $1 AND is_active = true
       LIMIT 1`,
      email
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return {
      id: rows[0].id,
      email: rows[0].email,
      password: rows[0].password,
      name: rows[0].name,
      role: rows[0].role,
      tenantId: rows[0].tenant_id,
      createdAt: rows[0].created_at,
    };
  }

  async findById(id: string): Promise<UserResponse | null> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT id, email, name, role, tenant_id, created_at
       FROM users
       WHERE id = $1::uuid AND is_active = true
       LIMIT 1`,
      id
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      role: rows[0].role,
      tenantId: rows[0].tenant_id,
      createdAt: rows[0].created_at,
    };
  }

  async emailExists(email: string): Promise<boolean> {
    const rows: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
      email
    );
    return rows.length > 0;
  }
}
