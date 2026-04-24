import express, { Request, Response, NextFunction } from "express";
import { JdMatchService } from "../service/jd-match.service";
import { EvaluateMatchDto } from "../dto/evaluate-match.dto";
import {
  JdValidationError,
  JdNotFoundError,
  JdTenantMismatchError,
  JdForbiddenError,
} from "../domain/errors";

export const jdMatchRouter = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    tenantId: string;
  };
}

const jdMatchService = new JdMatchService();

function buildContext(req: AuthenticatedRequest) {
  if (!req.user || !req.user.tenantId) {
    throw new JdTenantMismatchError("Tenant ID is required");
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

function errorResponse(res: Response, status: number, message: string) {
  const requestId = (res.req.headers["x-request-id"] as string) || "";
  return res.status(status).json({
    success: false,
    message,
    requestId,
  });
}

/** Error handler middleware for JD Match routes */
function handleJdMatchError(error: unknown, res: Response): boolean {
  if (error instanceof JdValidationError) {
    errorResponse(res, 400, error.message);
    return true;
  }
  if (error instanceof JdNotFoundError) {
    errorResponse(res, 404, error.message);
    return true;
  }
  if (error instanceof JdTenantMismatchError) {
    errorResponse(res, 403, error.message);
    return true;
  }
  if (error instanceof JdForbiddenError) {
    errorResponse(res, 403, error.message);
    return true;
  }
  return false;
}

// POST /jd-match/evaluate - Evaluate resume against job description
jdMatchRouter.post(
  "/evaluate",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const context = buildContext(req);
      const dto: EvaluateMatchDto = req.body;

      const { report } = await jdMatchService.evaluateMatch(dto, context);

      successResponse(res, {
        matchReportId: report.id,
        overallMatch: report.score.overall,
        skillsMatch: report.skillsMatch,
        keywordMatch: report.keywordAnalysis.toJSON(),
        experienceMatch: report.experienceMatch,
        roleFitScore: report.score.sections.roleFit,
        suggestions: report.suggestions,
      });
    } catch (error) {
      if (!handleJdMatchError(error, res)) {
        next(error);
      }
    }
  }
);

// GET /jd-match/report/:versionId - Get latest match report for a version
jdMatchRouter.get(
  "/report/:versionId",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const context = buildContext(req);
      const { versionId } = req.params;

      const report = await jdMatchService.getReportByVersionId(versionId, context);
      successResponse(res, report);
    } catch (error) {
      if (!handleJdMatchError(error, res)) {
        next(error);
      }
    }
  }
);

// GET /jd-match/reports/:resumeId - Get all match reports for a resume
jdMatchRouter.get(
  "/reports/:resumeId",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const context = buildContext(req);
      const { resumeId } = req.params;

      const reports = await jdMatchService.getReportsByResumeId(resumeId, context);
      successResponse(res, reports);
    } catch (error) {
      if (!handleJdMatchError(error, res)) {
        next(error);
      }
    }
  }
);
