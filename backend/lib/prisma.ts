import { PrismaClient } from "@prisma/client";

/**
 * Single PrismaClient for the process (avoids exhausting connections in dev).
 * Uses DATABASE_URL from backend/.env (Neon: use pooler host + sslmode + pgbouncer=true).
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
