export class JobCreatedEvent {
  constructor(
    public readonly jobId: string,
    public readonly tenantId: string | null,
    public readonly timestamp: Date = new Date()
  ) {}
}
