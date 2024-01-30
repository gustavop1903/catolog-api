// loginController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/users';

const secretKey = process.env.JWT_SECRET as jwt.Secret
const secretKeyRefresh = process.env.REFRESH_TOKEN_SECRET as jwt.Secret

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hash = user.password
    if (!hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcryptjs.compare(password, hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1000h' });
    const refreshToken = jwt.sign({ userId: user._id }, secretKeyRefresh, { expiresIn: '30d' });

    return res.json({ token, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error' });
  }
}

export default login;
