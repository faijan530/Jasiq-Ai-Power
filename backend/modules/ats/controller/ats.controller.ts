import express, { Request, Response, NextFunction } from "express";
import { AtsService } from "../service/ats.service";
import { EvaluateAtsDto } from "../dto/evaluate-ats.dto";
import {
  AtsValidationError,
  AtsNotFoundError,
  AtsTenantMismatchError,
  AtsForbiddenError,
} from "../domain/errors";

export const atsRouter = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    tenantId: string;
  };
}

const atsService = new AtsService();

function buildContext(req: AuthenticatedRequest) {
  if (!req.user || !req.user.tenantId) {
    throw new AtsTenantMismatchError("Tenant mismatch");
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

// POST /ats/evaluate - Evaluate ATS for a resume version
atsRouter.post("/evaluate", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const body = req.body as EvaluateAtsDto;
    const result = await atsService.evaluateAts(body, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("ATS evaluation error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof AtsValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error instanceof AtsNotFoundError) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error instanceof AtsTenantMismatchError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof AtsForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});

// GET /ats/report/:versionId - Get ATS report for a version
atsRouter.get("/report/:versionId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const context = buildContext(req);
    const result = await atsService.getAtsReportByVersionId(req.params.versionId, context);
    return successResponse(res, result);
  } catch (error) {
    console.error("ATS report error", { error: error instanceof Error ? error.message : String(error) });

    if (error instanceof AtsNotFoundError) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error instanceof AtsTenantMismatchError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error instanceof AtsForbiddenError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (respondIfDatabaseUnreachable(error, res)) return;
    return next(error);
  }
});
