export class JdValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JdValidationError";
  }
}

export class JdNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JdNotFoundError";
  }
}

export class JdTenantMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JdTenantMismatchError";
  }
}

export class JdForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JdForbiddenError";
  }
}
