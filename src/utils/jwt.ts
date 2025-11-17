import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '24h';

export const generateToken = (payload: string | object | Buffer): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): string | object | null => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
