import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AuthRepository, CreateUserData, UserResponse } from "../repository/auth.repository";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = "7d";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tenantId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export class AuthService {
  constructor(private readonly authRepo: AuthRepository) {}

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if email already exists
    const exists = await this.authRepo.emailExists(data.email);
    if (exists) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.authRepo.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      tenantId: data.tenantId,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await this.authRepo.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getCurrentUser(userId: string): Promise<UserResponse | null> {
    return this.authRepo.findById(userId);
  }

  verifyToken(token: string): { userId: string; email: string; role: UserRole } {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: UserRole };
  }
}
