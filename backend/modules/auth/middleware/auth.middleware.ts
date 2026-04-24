import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

// Extended request with full user for resume routes
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    tenantId: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// JWT middleware that fetches full user from DB for resume routes
export const jwtAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token, let devAuthMiddleware handle it
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    // Fetch full user from DB to get tenantId
    const userRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, email, name, role, tenant_id FROM users WHERE id = $1::uuid AND is_active = true`,
      decoded.userId
    );

    if (!userRows || userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userRows[0];
    req.user = {
      id: user.id,
      roles: [user.role],
      tenantId: user.tenant_id || "11111111-1111-1111-1111-111111111111",
    };

    next();
  } catch (error) {
    // Token invalid, let devAuthMiddleware handle it
    next();
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Not authenticated.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};
