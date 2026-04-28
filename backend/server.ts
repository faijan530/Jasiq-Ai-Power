import "dotenv/config";
import express from "express";
import cors from "cors";
import { resumeRouter } from "./modules/resume/controller/resume.controller";
import { atsRouter } from "./modules/ats/controller/ats.controller";
import { jdMatchRouter } from "./modules/jd-match/controller/jd-match.controller";
import { authRouter } from "./modules/auth/controller/auth.controller";
import { jobRouter } from "./modules/job-engine/controller/job.router";
import { devAuthMiddleware } from "./middleware/devAuth";
import { jwtAuthMiddleware } from "./modules/auth/middleware/auth.middleware";
import { prisma } from "./lib/prisma";

const app = express();

// Browsers forbid Access-Control-Allow-Origin: * when credentials are sent.
// Must echo the real origin when axios uses withCredentials: true.
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const allowedOrigins = [frontendOrigin, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow all origins in production (Render), localhost for dev
      if (!origin || allowedOrigins.includes(origin) || origin.includes('onrender.com')) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id", "x-dev-user-id", "x-dev-tenant-id", "x-dev-roles"],
  })
);
app.use(express.json());

// Dev-only: attach req.user so resume RBAC / tenant checks succeed until real auth is wired.
app.use(devAuthMiddleware);

app.get("/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", service: "jasiq-backend" });
});

app.use("/auth", authRouter);

// Apply JWT middleware to resume routes for proper user context
app.use("/resume", jwtAuthMiddleware, resumeRouter);

// Apply JWT middleware to ats routes for proper user context
app.use("/ats", jwtAuthMiddleware, atsRouter);

// Apply JWT middleware to jd-match routes for proper user context
app.use("/jd-match", jwtAuthMiddleware, jdMatchRouter);

// Apply JWT middleware to job-engine routes for proper user context
app.use("/jobs", jwtAuthMiddleware, jobRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

void (async () => {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log("Database: Prisma connected to Neon.");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "Database: Prisma could not connect (P1001 / network). Check: Neon project is active, DATABASE_URL uses pooler + sslmode=require + pgbouncer=true, firewall allows outbound 5432, or try the direct (non-pooler) host from the Neon dashboard.",
      err
    );
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend server listening on http://localhost:${port}`);
  });
})();

