import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { JdMatchService } from "../../service/jd-match.service";
import { JdValidationError, JdForbiddenError } from "../../domain/errors";

describe("JdMatch Integration Flow", () => {
  let service: JdMatchService;

  const mockContext = {
    userId: "11111111-1111-1111-1111-111111111111",
    tenantId: "22222222-2222-2222-2222-222222222222",
    roles: ["STUDENT"],
  };

  const mockAdminContext = {
    userId: "33333333-3333-3333-3333-333333333333",
    tenantId: "22222222-2222-2222-2222-222222222222",
    roles: ["ADMIN"],
  };

  beforeAll(() => {
    service = new JdMatchService(undefined, { enabled: false });
  });

  describe("evaluateMatch", () => {
    it("should reject non-STUDENT roles", async () => {
      const dto = {
        resumeId: "00000000-0000-0000-0000-000000000001",
        versionId: "00000000-0000-0000-0000-000000000002",
        jobDescription: "a".repeat(100), // Ensure > 50 words
      };

      await expect(
        service.evaluateMatch(dto, mockAdminContext)
      ).rejects.toThrow(JdForbiddenError);
    });

    it("should reject short job descriptions", async () => {
      const dto = {
        resumeId: "00000000-0000-0000-0000-000000000001",
        versionId: "00000000-0000-0000-0000-000000000002",
        jobDescription: "short description",
      };

      await expect(
        service.evaluateMatch(dto, mockContext)
      ).rejects.toThrow(JdValidationError);
    });

    it("should reject invalid UUIDs", async () => {
      const dto = {
        resumeId: "invalid-uuid",
        versionId: "00000000-0000-0000-0000-000000000002",
        jobDescription: "a".repeat(100),
      };

      await expect(
        service.evaluateMatch(dto, mockContext)
      ).rejects.toThrow(JdValidationError);
    });
  });
});
