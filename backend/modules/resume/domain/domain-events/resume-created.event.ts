export class ResumeCreatedEvent {
  constructor(
    public readonly resumeId: string,
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

