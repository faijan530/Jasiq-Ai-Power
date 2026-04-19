export class AtsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtsValidationError";
  }
}

export class AtsNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtsNotFoundError";
  }
}

export class AtsTenantMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtsTenantMismatchError";
  }
}

export class AtsForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtsForbiddenError";
  }
}
