import dotenv from 'dotenv'
import type { DatabaseConfig, RedisConfig, ServerConfig } from '../types/index.js'

// Cargar variables de entorno
dotenv.config()

const requiredEnvVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
]

// Validar variables de entorno requeridas
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export const config = {
  // Servidor
  server: {
    port: parseInt(process.env.PORT || '8000'),
    corsOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000' // Para desarrollo
    ],
    environment: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutos
      max: parseInt(process.env.RATE_LIMIT_MAX || '100')
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(',')
    }
  } as ServerConfig,

  // Base de datos
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    ssl: process.env.NODE_ENV === 'production',
    max: 20, // máximo número de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  } as DatabaseConfig,

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
  } as RedisConfig,

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRE || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  },

  // Microsoft Azure
  azure: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    tenantId: process.env.AZURE_TENANT_ID || '',
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:8000/auth/microsoft/callback',
    scopes: ['User.Read', 'Calendars.ReadWrite', 'OnlineMeetings.ReadWrite']
  },

  // Microsoft Graph
  graph: {
    scopes: process.env.GRAPH_SCOPES || 'https://graph.microsoft.com/.default'
  },

  // Email SMTP
  email: {
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },

  // Logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs'
  }
}

export default config