import express, { Request, Response, NextFunction } from "express";
import { ResumeService, RequestContext } from "../service/resume.service";
import { ResumeVersionService } from "../service/resume-version.service";
import { ResumeAIService } from "../service/resume-ai.service";
import { CreateResumeDto } from "../dto/create-resume.dto";
import { UpdateResumeDto } from "../dto/update-resume.dto";
import { ForbiddenError, UnauthorizedError, ValidationError } from "../domain/errors";
import { prisma } from "../../../lib/prisma";

export const resumeRouter = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    tenantId: string;
  };
}

const resumeService = new ResumeService();
const aiService = new ResumeAIService();

function buildContext(req: AuthenticatedRequest): RequestContext {
  if (!req.user || !req.user.tenantId) {
    throw new UnauthorizedError("Tenant mismatch");
  }

  return {
    userId: req.user.id,
    tenantId: req.user.tenantId,
    roles: req.user.roles,
  };
}

function successResponse(res: Response, data: unknown) {
  const requestId = (res.req.headers["x-request-id"] as string) || "";
  return res.status(200).json({
    success: true,
    data,
    requestId,
  });
}

/** Prisma P1001 / TCP failures — return JSON instead of raw stack to the client */
function respondIfDatabaseUnreachable(error: unknown, res: Response): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("Can't reach database") || msg.includes("P1001") || msg.includes("PrismaClientInitializationError")) {
    res.status(503).json({
      success: false,
      message:
        "Database unreachable. Confirm Neon is running, DATABASE_URL uses the pooler URL with sslmode=require and pgbouncer=true, and your network allows outbound TCP 5432.",
    });
    return true;
  }
  return false;
}

resumeRouter.post("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const body = req.body as CreateResumeDto;
    const result = await resumeService.createResume(body, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

resumeRouter.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const result = await resumeService.listResumes(context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

// Admin endpoint: List all resumes in tenant
resumeRouter.get("/admin/all", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const result = await resumeService.adminListAllResumes(context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Admin resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

// AI Chat endpoint - MUST be before /:id route
resumeRouter.post("/ai/chat", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message, resumeJson, currentTitle } = req.body as { message: string; resumeJson: unknown; currentTitle?: string };
    
    if (!message || !resumeJson) {
      return res.status(400).json({ success: false, message: "Message and resumeJson are required" });
    }

    const chatResponse = await aiService.chatWithAI(message, resumeJson as any, currentTitle);
    return res.json(chatResponse);
  } catch (error) {
    console.error("AI chat error", { error: error instanceof Error ? error.message : String(error) });
    return res.status(500).json({ success: false, message: "AI chat failed" });
  }
});

// AI Generate Full Resume endpoint - MUST be before /:id route
resumeRouter.post("/ai/generate-full-resume", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, role, skills } = req.body as { name: string; role: string; skills?: string[] };
    
    if (!name || !role) {
      return res.status(400).json({ success: false, message: "Name and role are required" });
    }

    const generatedResume = await aiService.generateFullResume({ name, role, skills });
    return successResponse(res, generatedResume);
  } catch (error) {
    console.error("AI generate resume error", { error: error instanceof Error ? error.message : String(error) });
    return res.status(500).json({ success: false, message: "AI resume generation failed" });
  }
});

resumeRouter.get("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const result = await resumeService.getResume(req.params.id, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

resumeRouter.put("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const body = req.body as UpdateResumeDto;
    const result = await resumeService.updateResume(req.params.id, body, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

resumeRouter.get("/:id/versions", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const resume = await resumeService.getResume(req.params.id, context);
    // getResume already enforces access; for versions we would normally use a dedicated service method.
    const versions = await new ResumeVersionService(prisma).getVersions(req.params.id);
    return successResponse(res, versions);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

resumeRouter.get("/:id/version/:versionId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const result = await resumeService.getResumeVersion(req.params.id, req.params.versionId, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

resumeRouter.post("/:id/ai/analyze", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const resume = await resumeService.getResume(req.params.id, context);
    
    if (!resume.latestVersion?.resumeJson) {
      return res.status(400).json({ success: false, message: "No resume content to analyze" });
    }

    const analysis = await aiService.analyzeResume(resume.latestVersion.resumeJson);
    return successResponse(res, analysis);
  } catch (error) {
    console.error("AI analysis error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "AI analysis failed" });
  }
});

resumeRouter.post("/:id/pdf", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const template = req.body?.template || "modern";
    const result = await resumeService.generatePdf(req.params.id, context, template);
    return successResponse(res, result);
  } catch (error) {
    console.error("Resume error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

