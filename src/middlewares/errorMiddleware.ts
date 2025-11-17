import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};
