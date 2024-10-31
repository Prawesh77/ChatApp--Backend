import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(`Bearer`)) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token);

  try {
    const secretKey = JWT_SECRET;
    const decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken);
    console.log(typeof decodedToken)
    if (typeof decodedToken === 'object' && 'id' in decodedToken) {
      req.user= decodedToken as UserPayload;
      console.log("Request",req.user);
      next()
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid Token or Token Expired.'});
  }
};

export default authentication;
