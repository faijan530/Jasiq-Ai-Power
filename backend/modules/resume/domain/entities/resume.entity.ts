export interface ResumeProps {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Resume {
  private constructor(private props: ResumeProps) {}

  static create(props: ResumeProps): Resume {
    return new Resume({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get title(): string {
    return this.props.title;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  rename(newTitle: string): void {
    this.props.title = newTitle;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): ResumeProps {
    return { ...this.props };
  }
}

