export interface ResumeVersionProps {
  id: string;
  resumeId: string;
  versionNumber: number;
  resumeJson: any;
  createdAt: Date;
}

export class ResumeVersion {
  private constructor(private props: ResumeVersionProps) {}

  static create(props: ResumeVersionProps): ResumeVersion {
    return new ResumeVersion({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get resumeId(): string {
    return this.props.resumeId;
  }

  get versionNumber(): number {
    return this.props.versionNumber;
  }

  get resumeJson(): any {
    return this.props.resumeJson;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): ResumeVersionProps {
    return { ...this.props };
  }
}

