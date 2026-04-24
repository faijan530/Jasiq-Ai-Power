export class JdMatchedEvent {
  constructor(
    public readonly matchReportId: string,
    public readonly resumeId: string,
    public readonly versionId: string,
    public readonly tenantId: string,
    public readonly overallMatch: number,
    public readonly jobTitle: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
