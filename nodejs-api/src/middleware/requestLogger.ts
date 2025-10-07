import { Request, Response, NextFunction } from 'express'
import { logRequest } from '../utils/logger.js'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  // Capturar cuando la respuesta termina
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    logRequest(req, res, responseTime)
  })
  
  next()
}