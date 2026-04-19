export class ResumeUpdatedEvent {
  constructor(
    public readonly resumeId: string,
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly versionNumber: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}

