declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        roles: string[];
      };
    }
  }
}

export {};
