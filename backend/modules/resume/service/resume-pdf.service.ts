import { ResumeVersion } from "../domain/entities/resume-version.entity";
import { ResumePdfGeneratedEvent } from "../domain/domain-events/resume-pdf-generated.event";

export class ResumePdfService {
  // Render JSON to HTML string with professional ATS-friendly CSS
  renderPdf(version: ResumeVersion): { html: string } {
    const json = version.resumeJson;
    
    const hasSkills = json.skills && json.skills.length > 0;
    const hasProjects = json.projects && json.projects.length > 0;
    const hasExperience = json.experience && json.experience.length > 0;
    const hasEducation = json.education && json.education.length > 0;
    const hasLinks = json.links && json.links.length > 0;
    
    const contacts: string[] = [];
    if (json.basics?.email) contacts.push(json.basics.email);
    if (json.basics?.phone) contacts.push(json.basics.phone);
    if (json.basics?.location) contacts.push(json.basics.location);
    const contactLine = contacts.join(" | ");
    
    const role = json.experience?.[0]?.role || "";
    
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${json.basics?.name ?? "Resume"}</title>
<style>
body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.5; color: #000; padding: 24px; max-width: 210mm; margin: 0 auto; background: #fff; }
ul { margin: 0; padding-left: 18px; }
li { margin-bottom: 4px; }
</style>
</head>
<body>

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 16px;">
  <div style="font-size: 22px; font-weight: bold; color: #000; margin-bottom: 6px; letter-spacing: 1px;">${json.basics?.name || ""}</div>
  ${role ? `<div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px;">${role}</div>` : ""}
  <div style="font-size: 12px; color: #555;">${contactLine}</div>
</div>
<div style="border-top: 1px solid #ccc; margin: 16px 0;"></div>

<!-- SUMMARY -->
${json.basics?.summary ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">SUMMARY</div>
  <p style="line-height: 1.6; margin-bottom: 8px; text-align: justify;">${json.basics.summary}</p>
</div>` : ""}

<!-- SKILLS -->
${hasSkills ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">SKILLS</div>
  <ul style="margin: 0 0 8px 0; padding-left: 18px;">
    ${json.skills.map((s: any) => `<li style="margin-bottom: 5px;">${s.name}${s.level ? ` <span style="color: #666;">(${s.level})</span>` : ""}</li>`).join("")}
  </ul>
</div>` : ""}

<!-- EXPERIENCE -->
${hasExperience ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">EXPERIENCE</div>
  ${json.experience.map((exp: any) => `
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">${exp.company}${exp.role ? ` — ${exp.role}` : ""}</div>
      <div style="font-size: 11px; color: #666; margin-bottom: 6px; font-style: italic;">${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? " – Present" : ""}${exp.location ? ` | ${exp.location}` : ""}</div>
      ${exp.highlights?.length ? `
      <ul style="margin: 0; padding-left: 18px;">
        ${exp.highlights.map((h: string) => `<li style="margin-bottom: 4px; line-height: 1.5;">${h}</li>`).join("")}
      </ul>` : ""}
    </div>
  `).join("")}
</div>` : ""}

<!-- EDUCATION -->
${hasEducation ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">EDUCATION</div>
  ${json.education.map((edu: any) => `
    <div style="margin-bottom: 10px;">
      <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">${edu.institution}</div>
      <div style="color: #444; font-size: 11px;">${edu.degree || ""}${edu.year ? ` <span style="color: #666;">(${edu.year})</span>` : ""}</div>
    </div>
  `).join("")}
</div>` : ""}

<!-- PROJECTS -->
${hasProjects ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">PROJECTS</div>
  ${json.projects.map((p: any) => `
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">${p.title}</div>
      ${p.description ? `<div style="margin-bottom: 4px; color: #333; font-size: 11px; line-height: 1.5;">${p.description}</div>` : ""}
      ${p.techStack?.length ? `<div style="margin-bottom: 6px; font-size: 10px; color: #666; font-style: italic;">Technologies: ${p.techStack.join(", ")}</div>` : ""}
      ${p.highlights?.length ? `
      <ul style="margin: 0; padding-left: 18px;">
        ${p.highlights.map((h: string) => `<li style="margin-bottom: 4px; line-height: 1.5;">${h}</li>`).join("")}
      </ul>` : ""}
    </div>
  `).join("")}
</div>` : ""}

<!-- LINKS -->
${hasLinks ? `
<div style="margin-top: 18px;">
  <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #000; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px;">LINKS</div>
  <div style="font-size: 11px;">
    ${json.links.map((l: any) => `<a href="${l.url}" style="color: #0066cc; text-decoration: none;">${l.label}</a>`).join(' <span style="color: #999;">|</span> ')}
  </div>
</div>` : ""}

</body>
</html>`;

    return { html };
  }

  // Mock upload to S3 and return a deterministic URL
  uploadPdf(resumeId: string, versionNumber: number): string {
    return `https://s3.mock/resume/${resumeId}/v${versionNumber}/resume.pdf`;
  }

  getPdfUrl(resumeId: string, versionNumber: number): string {
    return this.uploadPdf(resumeId, versionNumber);
  }

  emitPdfGeneratedEvent(resumeId: string, versionNumber: number, tenantId: string): ResumePdfGeneratedEvent {
    return new ResumePdfGeneratedEvent(resumeId, versionNumber, this.getPdfUrl(resumeId, versionNumber), tenantId);
  }
}

