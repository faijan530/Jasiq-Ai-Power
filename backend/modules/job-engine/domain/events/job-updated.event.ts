export class JobUpdatedEvent {
  constructor(
    public readonly jobId: string,
    public readonly tenantId: string | null,
    public readonly timestamp: Date = new Date()
  ) {}
}
