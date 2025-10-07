import Redis from 'ioredis'
import config from '../config/index.js'
import { logger } from './logger.js'

let redis: Redis | null = null

export const connectRedis = async (): Promise<Redis> => {
  if (redis) {
    return redis
  }

  try {
    interface RedisOptions {
      host: string;
      port: number;
      db: number;
      enableReadyCheck: boolean;
      maxRetriesPerRequest: number;
      password?: string;
    }

    const redisOptions: RedisOptions = {
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    }
    
    if (config.redis.password) {
      redisOptions.password = config.redis.password
    }
    
    redis = new Redis(redisOptions)

    redis.on('connect', () => {
      logger.info('Redis connected successfully')
    })

    redis.on('error', (error) => {
      logger.error('Redis connection error:', error)
    })

    redis.on('reconnecting', () => {
      logger.info('Redis reconnecting...')
    })

    return redis

  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

export const getRedis = (): Redis => {
  if (!redis) {
    throw new Error('Redis not connected')
  }
  return redis
}

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.disconnect()
    redis = null
    logger.info('Redis disconnected')
  }
}

export default { connectRedis, getRedis, disconnectRedis }