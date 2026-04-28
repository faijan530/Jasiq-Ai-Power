import { v4 as uuidv4, validate } from 'uuid';

export class JobId {
  constructor(public readonly value: string) {
    if (!validate(value)) {
      throw new Error('Invalid Job ID');
    }
  }

  static generate(): JobId {
    return new JobId(uuidv4());
  }
}
