

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        userName: string;
      };
    }
  }
}

export {};
