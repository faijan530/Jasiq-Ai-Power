import { CreateJobDto } from '../dto/create-job.dto';

export class JobValidator {
  static validateCreate(dto: CreateJobDto): void {
    if (!dto.title || dto.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    if (!dto.company || dto.company.trim().length < 2) {
      throw new Error('Company must be at least 2 characters long');
    }
    if (!dto.jdText || dto.jdText.trim().length === 0) {
      throw new Error('Job description text is required');
    }
    if (dto.applyLink && !this.isValidUrl(dto.applyLink)) {
      throw new Error('Invalid apply URL');
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
