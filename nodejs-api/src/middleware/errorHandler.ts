import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'yup'
import { logger } from '../utils/logger.js'

export class AppError extends Error {
  public statusCode: number
  public status: string
  public isOperational: boolean
  public code?: string
  public errors?: Record<string, string[]>

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
    this.isOperational = true
    if (code !== undefined) this.code = code
    if (errors !== undefined) this.errors = errors

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error personalizado para validación
export class ValidationAppError extends AppError {
  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 422, 'VALIDATION_ERROR', errors)
  }
}

// Error personalizado para autenticación
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

// Error personalizado para autorización
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

// Error personalizado para recursos no encontrados
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
  }
}

// Error personalizado para conflictos
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 409, 'CONFLICT_ERROR')
    if (details) {
      this.errors = { conflict: [JSON.stringify(details)] }
    }
  }
}

// Error personalizado para rate limiting
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR')
  }
}

// Convertir errores de Yup a nuestro formato
const handleYupValidationError = (error: ValidationError): ValidationAppError => {
  const errors: Record<string, string[]> = {}
  
  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((err) => {
      if (err.path) {
        if (!errors[err.path]) {
          errors[err.path] = []
        }
        errors[err.path]!.push(err.message)
      }
    })
  } else if (error.path) {
    errors[error.path] = [error.message]
  } else {
    errors.general = [error.message]
  }

  return new ValidationAppError('Validation failed', errors)
}

// Convertir errores de PostgreSQL
interface DatabaseError {
  code?: string;
  detail?: string;
  column?: string;
  message?: string;
}

const handleDatabaseError = (error: DatabaseError): AppError => {
  // Error de clave duplicada
  if (error.code === '23505') {
    const field = error.detail?.match(/Key \((.+?)\)=/)?.[1] || 'field'
    return new ConflictError(`Duplicate value for ${field}`)
  }

  // Error de referencia foránea
  if (error.code === '23503') {
    return new AppError('Referenced resource does not exist', 400, 'FOREIGN_KEY_ERROR')
  }

  // Error de restricción NOT NULL
  if (error.code === '23502') {
    const field = error.column || 'field'
    return new ValidationAppError('Missing required fields', {
      [field]: ['This field is required']
    })
  }

  // Error de restricción CHECK
  if (error.code === '23514') {
    return new ValidationAppError('Invalid data format', {
      general: ['Data does not meet validation requirements']
    })
  }

  // Error genérico de base de datos
  return new AppError('Database operation failed', 500, 'DATABASE_ERROR')
}

// Convertir errores de JWT
interface JWTError {
  name?: string;
  message?: string;
}

const handleJWTError = (error: JWTError): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token')
  }
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired')
  }
  return new AuthenticationError('Authentication failed')
}

// Middleware principal de manejo de errores
interface UnknownError {
  message?: string;
  statusCode?: number;
  code?: string;
  name?: string;
}

export const errorHandler = (
  error: UnknownError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let appError: AppError

  // Si ya es un AppError, usarlo directamente
  if (error instanceof AppError) {
    appError = error
  }
  // Manejo específico de errores de validación Yup
  else if (error instanceof ValidationError) {
    appError = handleYupValidationError(error)
  }
  // Manejo de errores de base de datos
  else if (error.code && typeof error.code === 'string') {
    appError = handleDatabaseError(error)
  }
  // Manejo de errores de JWT
  else if (error.name && ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
    appError = handleJWTError(error)
  }
  // Error genérico
  else {
    appError = new AppError(
      error.message || 'Internal server error',
      error.statusCode || 500,
      error.code || 'INTERNAL_ERROR'
    )
  }

  // Logging del error
  if (appError.statusCode >= 500) {
    logger.error('Server Error:', {
      message: appError.message,
      stack: appError.stack,
      statusCode: appError.statusCode,
      code: appError.code,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body,
      params: req.params,
      query: req.query
    })
  } else {
    logger.warn('Client Error:', {
      message: appError.message,
      statusCode: appError.statusCode,
      code: appError.code,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    })
  }

  // Respuesta de error
  interface ErrorResponse {
    success: boolean;
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
    stack?: string;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    message: appError.message
  }

  if (appError.code) {
    errorResponse.code = appError.code
  }

  // Agregar errores de validación si existen
  if (appError.errors && Object.keys(appError.errors).length > 0) {
    errorResponse.errors = appError.errors
  }

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development' && appError.statusCode >= 500 && appError.stack) {
    errorResponse.stack = appError.stack
  }

  res.status(appError.statusCode).json(errorResponse)
}

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`)
  next(error)
}

// Middleware para capturar errores asíncronos
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Función utilitaria para crear respuestas de éxito
interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export const successResponse = <T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>
): SuccessResponse<T> => {
  const response: SuccessResponse<T> = {
    success: true,
    data
  }

  if (message) {
    response.message = message
  }

  if (meta) {
    response.meta = meta
  }

  return response
}

// Función utilitaria para manejar paginación en respuestas
export const paginatedResponse = <T>(
  data: T[],
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
  message?: string
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  return successResponse(data, message, {
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    }
  })
}

export default errorHandler