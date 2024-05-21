import mongoose from "mongoose";
import { logger } from "./logger.middleware.js";

export class ApplicationError extends Error {
  constructor(statusCode, errMessage) {
    super(errMessage);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  // Error logging
  logger.error(
    `Timestamp: ${new Date().toString()} Req Method: ${req.method} Req URL: ${
      req.url
    } Error: ${err.message} Stack: ${err.stack}`
  );

  // Response Preparation
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.ValidatorError
  ) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err instanceof mongoose.Error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Database error occured, Please contact administrator",
      });
  }

  res.status(500).json({
    success: false,
    error: "Something went wrong",
  });
};
