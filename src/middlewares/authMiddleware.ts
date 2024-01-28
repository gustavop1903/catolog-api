import dotenv from 'dotenv'
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { } from "csurf";
import User from '../models/users';
dotenv.config()

const secretKey = process.env.JWT_SECRET as Secret

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso não fornecido' });
  }

  jwt.verify(token, secretKey, (err, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return authenticateRefreshToken(req, res, next);
      } else {
        return res.status(403).json({ message: 'Token inválido' });
      }
    }
    req.user = user;
    next();
  });
};

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token não fornecido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token inválido' });
  }
};
