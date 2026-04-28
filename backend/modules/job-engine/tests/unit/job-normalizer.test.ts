import { JobNormalizerService } from '../../service/job-normalizer.service';

describe('JobNormalizerService', () => {
  let service: JobNormalizerService;

  beforeEach(() => {
    service = new JobNormalizerService();
  });

  it('should normalize job data with trimmed strings and lowercased skills', () => {
    const rawData = {
      title: '  Software Engineer  ',
      company: ' Tech Corp ',
      skillsRequired: ['React', ' NODEJS '],
      jdText: '  We are looking for...  '
    };

    const normalized = service.normalize(rawData);

    expect(normalized.title).toBe('Software Engineer');
    expect(normalized.company).toBe('Tech Corp');
    expect(normalized.skillsRequired).toEqual(['react', 'nodejs']);
    expect(normalized.jdText).toBe('We are looking for...');
  });

  it('should provide default values for missing fields', () => {
    const rawData = {
      title: 'Developer',
      company: 'Startup',
      jdText: 'Coding'
    };

    const normalized = service.normalize(rawData);

    expect(normalized.location).toBeNull();
    expect(normalized.employmentType).toBeNull();
    expect(normalized.skillsRequired).toEqual([]);
    expect(normalized.source).toBe('MANUAL');
  });
});
