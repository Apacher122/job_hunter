import { ApiError } from "../types/errorTypes.js";
import { ErrorCodes } from "../types/errorTypes.js";

export const errorResponse = (statusCode: number, errorCode: ErrorCodes, message: string, details?: string): ApiError => {
  return {
    status: statusCode,
    errorCode: errorCode,
    message: message,
    details,
    timestamp: new Date().toISOString()
  }
};