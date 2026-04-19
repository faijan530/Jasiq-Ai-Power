export class AtsEvaluatedEvent {
  constructor(
    public readonly atsReportId: string,
    public readonly resumeId: string,
    public readonly versionId: string,
    public readonly tenantId: string,
    public readonly overallScore: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}
