export class ResumeId {
  private constructor(public readonly value: string) {}

  static create(value: string): ResumeId {
    if (!ResumeId.isUuid(value)) {
      throw new Error("Invalid ResumeId format");
    }
    return new ResumeId(value);
  }

  private static isUuid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}

