export class ResumeVersionNumber {
  private constructor(public readonly value: number) {}

  static create(value: number): ResumeVersionNumber {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("Resume version number must be a positive integer");
    }
    return new ResumeVersionNumber(value);
  }
}

