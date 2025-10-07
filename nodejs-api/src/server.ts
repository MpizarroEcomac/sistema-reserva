#!/usr/bin/env node

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import config from './config/index.js'
import { logger } from './utils/logger.js'
import { connectDatabase, disconnectDatabase } from './database/connection.js'
import { connectRedis } from './utils/redis.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

// Importar rutas
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import siteRoutes from './routes/sites.js'
import resourceRoutes from './routes/resources.js'
import bookingRoutes from './routes/bookings.js'
import notificationRoutes from './routes/notifications.js'
import { setupSocketHandlers } from './services/socketService.js'

class Server {
  private app: express.Application
  private server: any
  private io: SocketIOServer

  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.server.corsOrigins,
        methods: ['GET', 'POST']
      }
    })
    
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeSocket()
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }))

    // CORS
    this.app.use(cors({
      origin: config.server.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }))

    // Compression
    this.app.use(compression())

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.server.rateLimit.windowMs,
      max: config.server.rateLimit.max,
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
    this.app.use('/api/', limiter)

    // Body parsing
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf.toString())
        } catch (e) {
          const error = new Error('Invalid JSON')
          ;(error as any).status = 400
          throw error
        }
      }
    }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Request logging
    if (config.server.environment === 'development') {
      this.app.use(morgan('dev'))
    } else {
      this.app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))
    }

    this.app.use(requestLogger)

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.server.environment,
        version: '1.0.0'
      })
    })

    // API info
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'Reservas API',
        version: '1.0.0',
        description: 'API REST para sistema de reservas con integración Microsoft',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          sites: '/api/sites',
          resources: '/api/resources',
          bookings: '/api/bookings',
          notifications: '/api/notifications'
        },
        documentation: '/api/docs',
        health: '/health'
      })
    })
  }

  private initializeRoutes(): void {
    // API Routes
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/sites', siteRoutes)
    this.app.use('/api/resources', resourceRoutes)
    this.app.use('/api/bookings', bookingRoutes)
    this.app.use('/api/notifications', notificationRoutes)
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler)
    
    // Error handler
    this.app.use(errorHandler)
  }

  private initializeSocket(): void {
    setupSocketHandlers(this.io)
    logger.info('Socket.IO handlers initialized')
  }

  public async start(): Promise<void> {
    try {
      // Conectar a la base de datos (opcional para desarrollo)
      try {
        await connectDatabase()
        logger.info('Database connected successfully')
      } catch (error) {
        logger.warn('Database connection failed - continuing without database:', error)
      }

      // Conectar a Redis (opcional para desarrollo)
      try {
        await connectRedis()
        logger.info('Redis connected successfully')
      } catch (error) {
        logger.warn('Redis connection failed - continuing without Redis:', error)
      }

      // Iniciar servidor
      this.server.listen(config.server.port, () => {
        logger.info(`🚀 Server running on port ${config.server.port}`)
        logger.info(`📚 API documentation available at http://localhost:${config.server.port}/api`)
        logger.info(`🏥 Health check available at http://localhost:${config.server.port}/health`)
        logger.info(`🌍 Environment: ${config.server.environment}`)
        
        if (config.server.environment === 'development') {
          logger.info(`🔗 CORS enabled for: ${config.server.corsOrigins.join(', ')}`)
        }
      })

      // Graceful shutdown
      this.setupGracefulShutdown()

    } catch (error) {
      logger.error('Failed to start server:', error)
      process.exit(1)
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`)
      
      try {
        // Cerrar servidor HTTP
        this.server.close(() => {
          logger.info('HTTP server closed')
        })

        // Cerrar Socket.IO
        this.io.close(() => {
          logger.info('Socket.IO server closed')
        })

        // Desconectar base de datos
        await disconnectDatabase()
        logger.info('Database disconnected')

        // Cerrar Redis connections se manejan automáticamente

        logger.info('Graceful shutdown completed')
        process.exit(0)
      } catch (error) {
        logger.error('Error during graceful shutdown:', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
      process.exit(1)
    })
  }

  public getApp(): express.Application {
    return this.app
  }

  public getIO(): SocketIOServer {
    return this.io
  }
}

// Inicializar y ejecutar servidor
const server = new Server()

if (process.env.NODE_ENV !== 'test') {
  server.start()
}

export default server
export { Server }