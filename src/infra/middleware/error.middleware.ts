import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../../constants/error-messages.enum';
import { IHTTPError } from '../exception/errors.extension';

export const exceptionHandler = (
  error: IHTTPError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || ErrorMessages.Generic;

  return res.status(statusCode).send({ statusCode, message });
};