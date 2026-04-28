import { JobId } from '../value-objects/job-id.vo';

export class Job {
  constructor(
    public readonly id: JobId,
    public readonly tenantId: string | null,
    public readonly title: string,
    public readonly company: string,
    public readonly location: string | null,
    public readonly employmentType: string | null,
    public readonly skillsRequired: string[],
    public readonly minExperience: number | null,
    public readonly maxExperience: number | null,
    public readonly jdText: string,
    public readonly source: string | null,
    public readonly applyLink: string | null,
    public readonly postedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
