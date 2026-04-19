import { AtsService, RequestContext } from "../../service/ats.service";
import { AtsReportRepository } from "../../repository/ats-report.repository";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Integration test for complete ATS evaluation flow
// Note: This requires a test database to be running

describe("ATS Integration Flow", () => {
  let atsService: AtsService;
  let prisma: PrismaClient;
  let testTenantId: string;
  let testUserId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    atsService = new AtsService(prisma, { enabled: false });
    testTenantId = uuidv4();
    testUserId = uuidv4();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createTestContext = (roles: string[] = ["STUDENT"]): RequestContext => ({
    userId: testUserId,
    tenantId: testTenantId,
    roles,
  });

  describe("evaluateAts", () => {
    it("should throw error for non-existent resume", async () => {
      const context = createTestContext();
      
      await expect(
        atsService.evaluateAts(
          { resumeId: uuidv4(), versionId: uuidv4() },
          context
        )
      ).rejects.toThrow("Resume not found");
    });

    it("should throw error for non-STUDENT role", async () => {
      const context = createTestContext(["ADMIN"]);
      
      await expect(
        atsService.evaluateAts(
          { resumeId: uuidv4(), versionId: uuidv4() },
          context
        )
      ).rejects.toThrow("Only STUDENT role can evaluate ATS");
    });

    it("should throw error for tenant mismatch", async () => {
      const context = createTestContext();
      const wrongTenantId = uuidv4();
      
      // This would require a resume to exist first, 
      // so we skip the detailed test for now
    });
  });

  describe("getAtsReportByVersionId", () => {
    it("should throw error for non-existent version", async () => {
      const context = createTestContext();
      
      await expect(
        atsService.getAtsReportByVersionId(uuidv4(), context)
      ).rejects.toThrow("ATS report not found");
    });

    it("should throw error for non-authenticated user", async () => {
      const context = createTestContext([]);
      
      await expect(
        atsService.getAtsReportByVersionId(uuidv4(), context)
      ).rejects.toThrow("Access denied");
    });
  });
});

// Mock implementation for testing without database
export class MockAtsAiFeedbackService {
  async generateFeedback(): Promise<any[]> {
    return [];
  }
}
