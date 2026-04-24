import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "../service/auth.service";
import { UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const authRepo = new AuthRepository(prisma);
const authService = new AuthService(authRepo);

export const authRouter = Router();

// POST /auth/register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, tenantId } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, name, and role are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Validate role
    const validRoles: UserRole[] = ["STUDENT", "ADMIN", "PLACEMENT_OFFICER", "RECRUITER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const result = await authService.register({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role,
      tenantId: tenantId || "11111111-1111-1111-1111-111111111111",
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("[AuthController] Register error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

// POST /auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login({
      email: email.toLowerCase().trim(),
      password,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("[AuthController] Login error:", error);
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
});

// GET /auth/me (get current user)
authRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    const user = await authService.getCurrentUser(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("[AuthController] Get current user error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// POST /auth/create-admin (system admin only: create new admin user)
authRouter.post("/create-admin", async (req: Request, res: Response) => {
  try {
    // Verify the requesting user is an admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    const requestingUser = await authService.getCurrentUser(decoded.userId);

    if (!requestingUser || requestingUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only ADMIN users can create new admins",
      });
    }

    // Only the primary (first) system admin can create other admins
    // Find the oldest admin in the tenant
    const oldestAdmin = await prisma.$queryRawUnsafe(
      `SELECT id FROM users 
       WHERE role = 'ADMIN' AND tenant_id = $1::uuid AND is_active = true
       ORDER BY created_at ASC LIMIT 1`,
      requestingUser.tenantId || "11111111-1111-1111-1111-111111111111"
    ) as any[];

    if (!oldestAdmin || oldestAdmin.length === 0 || oldestAdmin[0].id !== requestingUser.id) {
      return res.status(403).json({
        success: false,
        message: "Only the primary system administrator can create new admin users",
      });
    }

    const { email, password, name, tenantId } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Create admin user
    const result = await authService.register({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role: "ADMIN",
      tenantId: tenantId || requestingUser.tenantId || "11111111-1111-1111-1111-111111111111",
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "Admin user created successfully",
    });
  } catch (error: any) {
    console.error("[AuthController] Create admin error:", error);
    // Log more details for debugging
    if (error.message) console.error("Error message:", error.message);
    if (error.code) console.error("Error code:", error.code);
    if (error.meta) console.error("Error meta:", error.meta);
    
    res.status(400).json({
      success: false,
      message: error.message || error.toString() || "Failed to create admin user",
    });
  }
});

// GET /auth/admins (admin-only: list all admin users)
authRouter.get("/admins", async (req: Request, res: Response) => {
  try {
    // Verify the requesting user is an admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    const requestingUser = await authService.getCurrentUser(decoded.userId);

    if (!requestingUser || requestingUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only ADMIN users can view admin list",
      });
    }

    // Get all admin users in the same tenant
    const admins = await prisma.$queryRawUnsafe(
      `SELECT id, email, name, role, is_active, created_at, updated_at 
       FROM users 
       WHERE role = 'ADMIN' AND tenant_id = $1::uuid AND is_active = true
       ORDER BY created_at DESC`,
      requestingUser.tenantId || "11111111-1111-1111-1111-111111111111"
    ) as any[];

    res.json({
      success: true,
      data: admins.map(admin => ({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.is_active,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at,
      })),
    });
  } catch (error: any) {
    console.error("[AuthController] List admins error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin users",
    });
  }
});
