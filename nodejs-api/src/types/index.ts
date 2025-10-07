import { Request } from 'express'

// Tipos de usuario y autenticación
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  azureId?: string
  emailVerifiedAt?: Date
  mfaEnabled: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'user' | 'reception' | 'site_admin' | 'super_admin'

export interface AuthTokenPayload {
  userId: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Tipos de sedes y recursos
export interface Site {
  id: string
  name: string
  code: string
  address: string
  timezone: string
  isActive: boolean
  settings: SiteSettings
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettings {
  operatingHours: {
    start: string // HH:mm format
    end: string   // HH:mm format
  }
  businessDays: number[] // [1,2,3,4,5] = Lun-Vie
  maxAdvanceBookingDays: number
  autoReleaseMinutes: number
}

export interface ResourceType {
  id: string
  name: string
  code: string
  icon: string
  color: string
  description?: string
  isActive: boolean
}

export interface Resource {
  id: string
  name: string
  code: string
  siteId: string
  resourceTypeId: string
  capacity?: number
  equipment: string[]
  tags: string[]
  isActive: boolean
  settings: ResourceSettings
  createdAt: Date
  updatedAt: Date
}

export interface ResourceSettings {
  minBookingMinutes: number
  maxBookingMinutes: number
  bufferMinutes: number
  maxDailyBookings: number
  requiresApproval: boolean
  allowRecurring: boolean
}

// Tipos de reservas
export interface Booking {
  id: string
  userId: string
  resourceId: string
  title: string
  description?: string
  startAt: Date
  endAt: Date
  status: BookingStatus
  attendees?: number
  metadata?: BookingMetadata
  outlookEventId?: string
  teamsUrl?: string
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface BookingMetadata {
  // Para salas
  meetingTitle?: string
  externalGuests?: string[]
  equipment?: string[]
  catering?: boolean
  
  // Para estacionamiento
  vehiclePlate?: string
  vehicleType?: 'car' | 'motorcycle' | 'bicycle'
  
  // General
  notes?: string
  checkInAt?: Date
  checkOutAt?: Date
}

// Tipos para requests
export interface AuthenticatedRequest extends Request {
  user?: User
  token?: string
}

export interface CreateBookingRequest {
  resourceId: string
  title: string
  description?: string
  startAt: string
  endAt: string
  attendees?: number
  metadata?: BookingMetadata
  createOutlookEvent?: boolean
  createTeamsMeeting?: boolean
}

export interface UpdateBookingRequest {
  title?: string
  description?: string
  startAt?: string
  endAt?: string
  attendees?: number
  metadata?: BookingMetadata
  status?: BookingStatus
}

// Tipos para respuestas API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    pagination?: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
}

export interface ApiError {
  message: string
  code?: string
  status: number
  errors?: Record<string, string[]>
}

// Tipos para base de datos
export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean
  max?: number
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
}

export interface RedisConfig {
  host: string
  port: number
  password?: string
  db: number
}

// Tipos para Microsoft Graph
export interface GraphUser {
  id: string
  mail: string
  displayName: string
  userPrincipalName: string
  jobTitle?: string
  department?: string
}

export interface OutlookEvent {
  id: string
  subject: string
  body: {
    contentType: 'html' | 'text'
    content: string
  }
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: {
    displayName: string
  }
  attendees?: Array<{
    emailAddress: {
      address: string
      name: string
    }
  }>
}

export interface TeamsOnlineMeeting {
  id: string
  joinUrl: string
  joinWebUrl: string
  subject: string
  startDateTime: string
  endDateTime: string
}

// Tipos para notificaciones
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  readAt?: Date
  createdAt: Date
}

export type NotificationType = 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'booking_modified' | 'system_maintenance'

// Tipos para WebSocket
export interface SocketUser {
  userId: string
  socketId: string
  siteId?: string
}

export interface WebSocketEvent {
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'availability_changed'
  data: Record<string, unknown>
  userId?: string
  siteId?: string
}

// Tipos para validación
export interface ValidationError {
  field: string
  message: string
  code: string
}

// Tipos para paginación
export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Tipos para filtros
export interface BookingFilters {
  userId?: string
  resourceId?: string
  siteId?: string
  status?: BookingStatus[]
  startDate?: string
  endDate?: string
  resourceType?: string
}

export interface ResourceFilters {
  siteId?: string
  resourceTypeId?: string
  capacity?: number
  tags?: string[]
  equipment?: string[]
  isActive?: boolean
}

// Tipos para estadísticas
export interface BookingStats {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  noShows: number
  occupancyRate: number
  averageBookingDuration: number
  peakHours: Array<{ hour: number; bookings: number }>
  topUsers: Array<{ userId: string; userName: string; bookings: number }>
  topResources: Array<{ resourceId: string; resourceName: string; bookings: number }>
}

export interface AvailabilitySlot {
  startAt: Date
  endAt: Date
  isAvailable: boolean
  resourceId: string
  bookingId?: string
  conflictReason?: string
}

// Configuración del servidor
export interface ServerConfig {
  port: number
  corsOrigins: string[]
  environment: 'development' | 'production' | 'test'
  rateLimit: {
    windowMs: number
    max: number
  }
  upload: {
    maxFileSize: number
    allowedTypes: string[]
  }
}