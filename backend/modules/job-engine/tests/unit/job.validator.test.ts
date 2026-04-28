import { JobValidator } from '../../validators/job.validator';

describe('JobValidator', () => {
  it('should not throw on valid job data', () => {
    expect(() => {
      JobValidator.validateCreate({
        title: 'Software Engineer',
        company: 'Tech Corp',
        jdText: 'Job description text here'
      });
    }).not.toThrow();
  });

  it('should throw if title is too short', () => {
    expect(() => {
      JobValidator.validateCreate({
        title: 'SE',
        company: 'Tech Corp',
        jdText: 'Job description text here'
      });
    }).toThrow('Title must be at least 3 characters long');
  });

  it('should throw if apply link is invalid url', () => {
    expect(() => {
      JobValidator.validateCreate({
        title: 'Software Engineer',
        company: 'Tech Corp',
        jdText: 'Job description text here',
        applyLink: 'not-a-url'
      });
    }).toThrow('Invalid apply URL');
  });
});
