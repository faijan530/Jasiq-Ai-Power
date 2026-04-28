import { ResumeVersion } from "../domain/entities/resume-version.entity";
import { ResumePdfGeneratedEvent } from "../domain/domain-events/resume-pdf-generated.event";

export class ResumePdfService {
  renderPdf(version: ResumeVersion, templateId: string = "modern"): { html: string } {
    const json = version.resumeJson;
    
    switch (templateId) {
      case "classic":
        return { html: this.renderClassic(json) };
      case "creative":
        return { html: this.renderCreative(json) };
      case "simple":
        return { html: this.renderSimple(json) };
      case "modern":
      default:
        return { html: this.renderModern(json) };
    }
  }

  private renderModern(json: any): string {
    const contactLine = [json.basics?.email, json.basics?.phone, json.basics?.location].filter(Boolean).join(" | ");
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<style>
  body { font-family: "Inter", "Segoe UI", Arial, sans-serif; margin: 0; padding: 0; color: #333; background: #fff; font-size: 11px; line-height: 1.5; }
  .container { display: flex; width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; }
  .left-col { width: 32%; background-color: #1a56db; color: #fff; padding: 30px 20px; box-sizing: border-box; }
  .right-col { width: 68%; padding: 30px; box-sizing: border-box; }
  h1 { font-size: 24px; margin: 0 0 5px 0; color: #fff; font-weight: 700; letter-spacing: 0.5px; }
  h2 { font-size: 14px; margin: 0 0 20px 0; color: #93c5fd; font-weight: 500; }
  .contact-info { font-size: 10px; line-height: 1.8; margin-bottom: 30px; color: #e0e7ff; }
  .section-title-left { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; margin: 0 0 10px 0; color: #fff; }
  .section-title-right { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1a56db; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin: 0 0 15px 0; }
  .skills-list { list-style: none; padding: 0; margin: 0; }
  .skills-list li { margin-bottom: 6px; font-size: 10px; }
  .item { margin-bottom: 15px; }
  .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
  .item-title { font-weight: 700; font-size: 12px; color: #111827; }
  .item-date { font-size: 10px; color: #6b7280; font-weight: 600; }
  .item-subtitle { font-style: italic; font-size: 11px; color: #4b5563; margin-bottom: 5px; }
  .item-desc { text-align: justify; margin-bottom: 5px; }
  ul { margin: 0; padding-left: 15px; }
  li { margin-bottom: 3px; }
</style>
  <div class="container">
    <div class="left-col">
      <h1>${json.basics?.name || ""}</h1>
      <h2>${json.experience?.[0]?.role || "Professional"}</h2>
      <div class="contact-info">
        ${json.basics?.email ? `<div>Email: ${json.basics.email}</div>` : ""}
        ${json.basics?.phone ? `<div>Phone: ${json.basics.phone}</div>` : ""}
        ${json.basics?.location ? `<div>Location: ${json.basics.location}</div>` : ""}
      </div>
      
      ${json.skills?.length ? `
      <h3 class="section-title-left">Skills</h3>
      <ul class="skills-list">
        ${json.skills.map((s: any) => `<li>${s.name} ${s.level ? `<span style="opacity:0.7">(${s.level})</span>` : ""}</li>`).join("")}
      </ul>
      ` : ""}
      
      ${json.education?.length ? `
      <div style="margin-top: 30px;">
        <h3 class="section-title-left">Education</h3>
        ${json.education.map((e: any) => `
          <div style="margin-bottom: 10px; font-size: 10px;">
            <div style="font-weight: 700;">${e.institution}</div>
            <div style="color: #bfdbfe;">${e.degree}</div>
            <div style="opacity: 0.8;">${e.year || e.startYear + '-' + e.endYear}</div>
          </div>
        `).join("")}
      </div>
      ` : ""}
    </div>
    <div class="right-col">
      ${json.basics?.summary ? `
      <h3 class="section-title-right">Summary</h3>
      <div style="margin-bottom: 20px; text-align: justify;">${json.basics.summary}</div>
      ` : ""}
      
      ${json.experience?.length ? `
      <h3 class="section-title-right">Experience</h3>
      ${json.experience.map((e: any) => `
        <div class="item">
          <div class="item-header">
            <span class="item-title">${e.role}</span>
            <span class="item-date">${e.startDate || ""} ${e.endDate ? `- ${e.endDate}` : "- Present"}</span>
          </div>
          <div class="item-subtitle">${e.company} ${e.location ? `| ${e.location}` : ""}</div>
          ${e.responsibilities?.length ? `
          <ul>
            ${e.responsibilities.map((r: string) => `<li>${r}</li>`).join("")}
          </ul>` : ""}
        </div>
      `).join("")}
      ` : ""}
      
      ${json.projects?.length ? `
      <h3 class="section-title-right">Projects</h3>
      ${json.projects.map((p: any) => `
        <div class="item">
          <div class="item-header">
            <span class="item-title">${p.title}</span>
          </div>
          <div class="item-desc">${p.description || ""}</div>
          ${p.techStack?.length ? `<div style="font-size: 10px; color: #6b7280; font-style: italic;">Technologies: ${p.techStack.join(", ")}</div>` : ""}
        </div>
      `).join("")}
      ` : ""}
    </div>
  </div>
</body>
</html>`;
  }

  private renderClassic(json: any): string {
    const contactLine = [json.basics?.email, json.basics?.phone, json.basics?.location].filter(Boolean).join(" | ");
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<style>
  body { font-family: "Times New Roman", Times, serif; margin: 0 auto; padding: 40px; color: #000; background: #fff; font-size: 12px; line-height: 1.4; max-width: 210mm; }
  h1 { font-size: 26px; text-align: center; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
  .contact { text-align: center; font-size: 11px; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 10px; }
  .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 15px 0 10px 0; text-align: center; border-bottom: 1px solid #000; padding-bottom: 2px; }
  .item { margin-bottom: 12px; }
  .item-header { display: flex; justify-content: space-between; font-weight: bold; }
  .item-sub { display: flex; justify-content: space-between; font-style: italic; margin-bottom: 4px; }
  ul { margin: 0; padding-left: 20px; }
  li { margin-bottom: 2px; text-align: justify; }
</style>
  <h1>${json.basics?.name || ""}</h1>
  <div class="contact">${contactLine}</div>
  
  ${json.basics?.summary ? `
  <div class="section-title">SUMMARY</div>
  <div style="text-align: justify; margin-bottom: 15px;">${json.basics.summary}</div>
  ` : ""}
  
  ${json.experience?.length ? `
  <div class="section-title">EXPERIENCE</div>
  ${json.experience.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <span>${e.company}</span>
        <span>${e.location || ""}</span>
      </div>
      <div class="item-sub">
        <span>${e.role}</span>
        <span>${e.startDate || ""} ${e.endDate ? `- ${e.endDate}` : "- Present"}</span>
      </div>
      ${e.responsibilities?.length ? `
      <ul>
        ${e.responsibilities.map((r: string) => `<li>${r}</li>`).join("")}
      </ul>` : ""}
    </div>
  `).join("")}
  ` : ""}
  
  ${json.education?.length ? `
  <div class="section-title">EDUCATION</div>
  ${json.education.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <span>${e.institution}</span>
        <span>${e.year || e.startYear + '-' + e.endYear}</span>
      </div>
      <div class="item-sub">
        <span>${e.degree}</span>
      </div>
    </div>
  `).join("")}
  ` : ""}
  
  ${json.skills?.length ? `
  <div class="section-title">SKILLS</div>
  <div><strong>Core Competencies:</strong> ${json.skills.map((s: any) => s.name).join(", ")}</div>
  ` : ""}
</body>
</html>`;
  }

  private renderCreative(json: any): string {
    const contactLine = [json.basics?.email, json.basics?.phone, json.basics?.location].filter(Boolean).join(" • ");
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<style>
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0 auto; padding: 40px; color: #333; background: #fff; font-size: 11px; line-height: 1.6; max-width: 210mm; }
  .header { border-left: 4px solid #ff4757; padding-left: 15px; margin-bottom: 30px; }
  h1 { font-size: 32px; margin: 0 0 5px 0; color: #2f3542; font-weight: 800; letter-spacing: -0.5px; }
  .role { font-size: 16px; color: #ff4757; font-weight: 500; margin-bottom: 10px; }
  .contact { font-size: 10px; color: #747d8c; font-weight: 600; letter-spacing: 0.5px; }
  .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #2f3542; margin: 25px 0 15px 0; display: flex; align-items: center; }
  .section-title::after { content: ""; flex: 1; border-bottom: 1px dashed #ced6e0; margin-left: 10px; }
  .item { margin-bottom: 18px; }
  .item-title { font-weight: 700; font-size: 12px; color: #2f3542; }
  .item-meta { font-size: 10px; color: #ff4757; font-weight: 600; margin-bottom: 5px; }
  ul { margin: 0; padding-left: 15px; }
  li { margin-bottom: 4px; }
  .skills-container { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill-badge { background: #f1f2f6; color: #2f3542; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; border: 1px solid #dfe4ea; }
</style>
  <div class="header">
    <h1>${json.basics?.name || ""}</h1>
    <div class="role">${json.experience?.[0]?.role || ""}</div>
    <div class="contact">${contactLine}</div>
  </div>
  
  ${json.basics?.summary ? `
  <div class="section-title">Profile</div>
  <div style="text-align: justify;">${json.basics.summary}</div>
  ` : ""}
  
  ${json.experience?.length ? `
  <div class="section-title">Experience</div>
  ${json.experience.map((e: any) => `
    <div class="item">
      <div class="item-title">${e.role} @ ${e.company}</div>
      <div class="item-meta">${e.startDate || ""} ${e.endDate ? `- ${e.endDate}` : "- Present"}</div>
      ${e.responsibilities?.length ? `
      <ul>
        ${e.responsibilities.map((r: string) => `<li>${r}</li>`).join("")}
      </ul>` : ""}
    </div>
  `).join("")}
  ` : ""}
  
  <div style="display: flex; gap: 40px;">
    ${json.education?.length ? `
    <div style="flex: 1;">
      <div class="section-title">Education</div>
      ${json.education.map((e: any) => `
        <div class="item">
          <div class="item-title">${e.degree}</div>
          <div class="item-meta">${e.institution} | ${e.year || e.startYear + '-' + e.endYear}</div>
        </div>
      `).join("")}
    </div>
    ` : ""}
    
    ${json.skills?.length ? `
    <div style="flex: 1;">
      <div class="section-title">Expertise</div>
      <div class="skills-container">
        ${json.skills.map((s: any) => `<span class="skill-badge">${s.name}</span>`).join("")}
      </div>
    </div>
    ` : ""}
  </div>
</body>
</html>`;
  }

  private renderSimple(json: any): string {
    const contactLine = [json.basics?.email, json.basics?.phone, json.basics?.location].filter(Boolean).join(" | ");
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<style>
  body { font-family: Arial, Helvetica, sans-serif; margin: 0 auto; padding: 40px; color: #333; background: #fff; font-size: 11px; line-height: 1.5; max-width: 210mm; }
  h1 { font-size: 24px; margin: 0 0 5px 0; color: #000; }
  .contact { font-size: 11px; color: #666; margin-bottom: 20px; }
  .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 20px 0 10px 0; color: #000; }
  .item { margin-bottom: 12px; }
  .item-header { display: flex; justify-content: space-between; font-weight: bold; color: #000; }
  .item-sub { color: #555; margin-bottom: 4px; }
  ul { margin: 0; padding-left: 15px; }
  li { margin-bottom: 3px; }
</style>
  <h1>${json.basics?.name || ""}</h1>
  <div class="contact">${contactLine}</div>
  
  ${json.basics?.summary ? `
  <div class="section-title">SUMMARY</div>
  <div>${json.basics.summary}</div>
  ` : ""}
  
  ${json.experience?.length ? `
  <div class="section-title">EXPERIENCE</div>
  ${json.experience.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <span>${e.role}, ${e.company}</span>
        <span>${e.startDate || ""} ${e.endDate ? `- ${e.endDate}` : "- Present"}</span>
      </div>
      ${e.responsibilities?.length ? `
      <ul>
        ${e.responsibilities.map((r: string) => `<li>${r}</li>`).join("")}
      </ul>` : ""}
    </div>
  `).join("")}
  ` : ""}
  
  ${json.education?.length ? `
  <div class="section-title">EDUCATION</div>
  ${json.education.map((e: any) => `
    <div class="item">
      <div class="item-header">
        <span>${e.degree}, ${e.institution}</span>
        <span>${e.year || e.startYear + '-' + e.endYear}</span>
      </div>
    </div>
  `).join("")}
  ` : ""}
  
  ${json.skills?.length ? `
  <div class="section-title">SKILLS</div>
  <div>${json.skills.map((s: any) => s.name).join(", ")}</div>
  ` : ""}
</body>
</html>`;
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
