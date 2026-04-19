export class ResumePdfGeneratedEvent {
  constructor(
    public readonly resumeId: string,
    public readonly versionNumber: number,
    public readonly pdfUrl: string,
    public readonly tenantId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

