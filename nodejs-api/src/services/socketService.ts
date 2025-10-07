import { Server as SocketIOServer } from 'socket.io'
import { logger } from '../utils/logger.js'

export const setupSocketHandlers = (io: SocketIOServer): void => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`)
    })

    // Placeholder event handlers - will be implemented in next phase
    socket.on('join_room', (room) => {
      socket.join(room)
      logger.info(`Socket ${socket.id} joined room: ${room}`)
    })

    socket.on('leave_room', (room) => {
      socket.leave(room)
      logger.info(`Socket ${socket.id} left room: ${room}`)
    })
  })
}