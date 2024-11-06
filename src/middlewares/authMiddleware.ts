import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwtUtils.js";

export function authenticate(
  req: Request, 
  res: Response, 
  next: NextFunction
): any {
  const token: string | undefined = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET as string);
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
