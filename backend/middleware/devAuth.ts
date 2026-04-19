import type { Request, Response, NextFunction } from "express";

/**
 * In production, replace this with JWT/session middleware that sets req.user.
 * When USE_DEV_AUTH=true (local dev), injects a default user so resume APIs work without a full auth stack.
 */
export function devAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.user) {
    next();
    return;
  }

  const enabled = process.env.USE_DEV_AUTH === "true";
  if (!enabled) {
    next();
    return;
  }

  const id =
    (typeof req.headers["x-dev-user-id"] === "string" && req.headers["x-dev-user-id"]) ||
    process.env.DEV_USER_ID ||
    "11111111-1111-1111-1111-111111111111";

  const tenantId =
    (typeof req.headers["x-dev-tenant-id"] === "string" && req.headers["x-dev-tenant-id"]) ||
    process.env.DEV_TENANT_ID ||
    "22222222-2222-2222-2222-222222222222";

  const rolesHeader = req.headers["x-dev-roles"];
  const roles =
    typeof rolesHeader === "string" && rolesHeader.length > 0
      ? rolesHeader.split(",").map((r) => r.trim())
      : (process.env.DEV_ROLES?.split(",").map((r) => r.trim()) ?? ["STUDENT"]);

  req.user = { id, tenantId, roles };
  next();
}
