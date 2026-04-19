import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { resumeRouter } from "../../controller/resume.controller";

// Simple mock auth middleware
const mockAuth = (req: any, _res: any, next: any) => {
  req.user = {
    id: "11111111-1111-1111-1111-111111111111",
    tenantId: "22222222-2222-2222-2222-222222222222",
    roles: ["STUDENT"],
  };
  next();
};

describe("Resume Module Integration", () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(mockAuth);
  app.use("/resume", resumeRouter);

  const baseResume = {
    schemaVersion: 1,
    basics: {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      location: "City",
      summary: "Software engineer",
    },
    skills: [{ name: "TypeScript", level: "Advanced" }],
    projects: [
      {
        title: "Project A",
        description: "Did something",
        techStack: ["TS"],
        link: "https://example.com",
      },
    ],
    education: [],
    experience: [],
    achievements: [],
    links: [],
  };

  it("creates and fetches a resume", async () => {
    const createRes = await request(app)
      .post("/resume")
      .send({ title: "My Resume", resumeJson: baseResume });

    expect(createRes.status).toBe(200);
    expect(createRes.body.success).toBe(true);

    const resumeId = createRes.body.data.id;
    const getRes = await request(app).get(`/resume/${resumeId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.id).toBe(resumeId);
  });
});

