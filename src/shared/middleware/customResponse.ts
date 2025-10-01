import { ApiError, ErrorCodes } from "../types/errorTypes.js";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Response {
      sendError: (
        statusCode: number,
        errorCode: string,
        message: string,
        details?: any
      ) => Response;
    }
  }
}

export const customResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendError = (statusCode, errorCode, message, details) => {
    return res.status(statusCode).send(
      errorResponse(statusCode, errorCode as ErrorCodes, message, details)
    );
  };

  next();
};


const errorResponse = (statusCode: number, errorCode: ErrorCodes, message: string, details?: string): ApiError => {
  return {
    status: statusCode,
    errorCode: errorCode,
    message: message,
    details,
    timestamp: new Date().toISOString()
  }
};