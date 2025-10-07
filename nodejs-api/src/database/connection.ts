import pg from 'pg'
import config from '../config/index.js'
import { logger } from '../utils/logger.js'

const { Pool } = pg

let pool: pg.Pool | null = null

export const connectDatabase = async (): Promise<pg.Pool> => {
  if (pool) {
    return pool
  }

  try {
    pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
      ssl: config.database.ssl,
      max: config.database.max,
      idleTimeoutMillis: config.database.idleTimeoutMillis,
      connectionTimeoutMillis: config.database.connectionTimeoutMillis,
    })

    // Test connection
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()

    logger.info('Database connected successfully')
    return pool

  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    pool = null
    logger.info('Database disconnected')
  }
}

export const getPool = (): pg.Pool => {
  if (!pool) {
    throw new Error('Database not connected')
  }
  return pool
}

export default { connectDatabase, disconnectDatabase, getPool }