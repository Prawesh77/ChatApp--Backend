//req lai extended to add user in it, access garda(req.user)

interface UserPayload {
    id?: number;
    role?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  }
  
  declare namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }