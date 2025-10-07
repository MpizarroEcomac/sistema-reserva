import winston from 'winston'
import path from 'path'
import config from '../config/index.js'

// const __filename = fileURLToPath(import.meta.url) // Not used currently
// const __dirname = path.dirname(__filename) // Not used currently

// Crear directorio de logs si no existe
const logDir = path.join(process.cwd(), config.logging.dir)

// Configuración de formatos
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`
    if (Object.keys(meta).length > 0) {
      msg += ' ' + JSON.stringify(meta, null, 2)
    }
    return msg
  })
)

// Configurar transportes
const transports: winston.transport[] = []

// Console transport para desarrollo
if (config.server.environment === 'development') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat
    })
  )
} else {
  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: logFormat
    })
  )
}

// File transports para producción y desarrollo
if (config.server.environment !== 'test') {
  // Logs generales
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      level: config.logging.level,
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  )

  // Logs de errores
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  )

  // Logs de acceso HTTP (separado)
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      level: 'http',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 20
    })
  )
}

// Crear logger principal
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: 'reservas-api',
    environment: config.server.environment
  },
  transports,
  // Evitar que el proceso termine por errores no manejados
  exitOnError: false
})

// Logger específico para requests HTTP
export const httpLogger = winston.createLogger({
  level: 'http',
  format: logFormat,
  defaultMeta: {
    service: 'reservas-api',
    type: 'http'
  },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      format: logFormat
    })
  ]
})

// Logger específico para base de datos
export const dbLogger = winston.createLogger({
  level: 'debug',
  format: logFormat,
  defaultMeta: {
    service: 'reservas-api',
    type: 'database'
  },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'database.log'),
      format: logFormat
    })
  ]
})

// Funciones de utilidad para logging estructurado
export const logError = (error: Error, context?: string, metadata?: Record<string, unknown>) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context,
    metadata,
    timestamp: new Date().toISOString()
  })
}

export const logWarning = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger.warn({
    message,
    context,
    metadata,
    timestamp: new Date().toISOString()
  })
}

export const logInfo = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger.info({
    message,
    context,
    metadata,
    timestamp: new Date().toISOString()
  })
}

export const logDebug = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger.debug({
    message,
    context,
    metadata,
    timestamp: new Date().toISOString()
  })
}

// Logger para transacciones de base de datos
export const logQuery = (query: string, parameters?: unknown[], duration?: number) => {
  dbLogger.debug({
    type: 'query',
    query,
    parameters,
    duration,
    timestamp: new Date().toISOString()
  })
}

// Logger para requests HTTP
interface RequestLike {
  method: string;
  url: string;
  get: (header: string) => string | undefined;
  ip: string | undefined;
}

interface ResponseLike {
  statusCode: number;
}

export const logRequest = (req: RequestLike, res: ResponseLike, responseTime: number) => {
  httpLogger.http({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime,
    userAgent: req.get('User-Agent'),
    ip: req.ip || 'unknown',
    timestamp: new Date().toISOString()
  })
}

// Función para logging de performance
export const logPerformance = (operation: string, duration: number, metadata?: Record<string, unknown>) => {
  logger.info({
    type: 'performance',
    operation,
    duration,
    metadata,
    timestamp: new Date().toISOString()
  })
}

// Stream para Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim())
  }
}

export default logger