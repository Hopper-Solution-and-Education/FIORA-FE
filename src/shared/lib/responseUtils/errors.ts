import { NextApiRequest, NextApiResponse } from 'next';

// Base error class
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, any>, // Optional additional details
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype); // Ensure proper prototype chain
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    };
  }
}

// Specific error subclasses
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(401, message, details);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(404, message, details);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(409, message, details);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: Record<string, any>) {
    super(500, message, details);
    this.name = 'InternalServerError';
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, details);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

// Centralized error handler for API routes
export const errorHandler = async (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>,
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    await handler(req, res);
  } catch (error) {
    const appError = normalizeError(error);
    console.error(`[API Error] ${appError.message}`, {
      statusCode: appError.statusCode,
      details: appError.details,
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(appError.statusCode).json(appError.toJSON());
  }
};

// Normalize errors into AppError instances
const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  //   if (error instanceof z.ZodError) return new ValidationError('Validation failed', error.errors);
  console.log({ error });
  return new InternalServerError();
};

// Global uncaught exception handlers
export const setupGlobalErrorHandlers = () => {
  process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
    // Graceful shutdown (optional)
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
    // Optionally exit or recover
  });
};
