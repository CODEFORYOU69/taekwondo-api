import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../interfaces/error.interface';
import { config } from '../config/env';

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDev = config.NODE_ENV === 'development';
  
  // Loguer l'erreur complète en développement
  if (isDev) {
    console.error(`[Error]: ${err.message}`);
    console.error(err.stack);
  } else {
    // En production, loguer de manière plus discrète
    console.error(`[Error ${err.statusCode || 500}]: ${err.message}`);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur est survenue sur le serveur';

  // Réponse à l'utilisateur
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Inclure la stack trace uniquement en développement
    ...(isDev && { stack: err.stack })
  });
};
