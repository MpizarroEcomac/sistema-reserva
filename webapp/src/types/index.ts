// === FIGMA MCP REFERENCE ===
// Este archivo define los tipos TypeScript basados en los diseños de Figma
// Servidor MCP: http://127.0.0.1:3845/mcp

// Tipos de autenticación
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  emailVerifiedAt?: string
  mfaEnabled: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'user' | 'reception' | 'site_admin' | 'super_admin'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
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
  createdAt: string
  updatedAt: string
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
  site?: Site
  resourceType?: ResourceType
  createdAt: string
  updatedAt: string
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
  startAt: string // ISO datetime
  endAt: string   // ISO datetime
  status: BookingStatus
  attendees?: number
  metadata?: BookingMetadata
  user?: User
  resource?: Resource
  createdAt: string
  updatedAt: string
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
  checkInAt?: string
  checkOutAt?: string
}

export interface BookingRequest {
  resourceId: string
  title: string
  description?: string
  startAt: string
  endAt: string
  attendees?: number
  metadata?: BookingMetadata
}

// Tipos para disponibilidad
export interface AvailabilitySlot {
  startAt: string
  endAt: string
  isAvailable: boolean
  resourceId: string
  bookingId?: string
  conflictReason?: string
}

export interface AvailabilityQuery {
  siteId: string
  resourceTypeId?: string
  resourceIds?: string[]
  date: string // YYYY-MM-DD
  startTime?: string // HH:mm
  endTime?: string   // HH:mm
}

// Tipos para reglas de negocio
export interface RuleSet {
  id: string
  name: string
  siteId: string
  resourceTypeId?: string
  resourceId?: string
  rules: BusinessRule[]
  isActive: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

export interface BusinessRule {
  type: RuleType
  condition: RuleCondition
  action: RuleAction
  message?: string
}

export type RuleType = 'time_restriction' | 'capacity_limit' | 'advance_booking' | 'buffer_time' | 'recurring_limit'

export interface RuleCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between'
  value: any
}

export interface RuleAction {
  type: 'allow' | 'deny' | 'require_approval' | 'warning'
  params?: Record<string, any>
}

// Tipos para reportes
export interface UsageReport {
  period: ReportPeriod
  siteId?: string
  resourceTypeId?: string
  metrics: {
    totalBookings: number
    confirmedBookings: number
    cancelledBookings: number
    noShows: number
    occupancyRate: number
    averageBookingDuration: number
    peakHours: { hour: number; bookings: number }[]
    topUsers: { userId: string; userName: string; bookings: number }[]
    topResources: { resourceId: string; resourceName: string; bookings: number }[]
  }
}

export type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'

// Tipos para notificaciones
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  readAt?: string
  createdAt: string
}

export type NotificationType = 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'booking_modified' | 'system_maintenance'

// Tipos para formularios (VeeValidate)
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: string
}

// Tipos para componentes UI
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  icon?: string
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}

export interface TableData {
  columns: TableColumn[]
  rows: Record<string, any>[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    pagination?: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// Tipos para el estado global
export interface AppState {
  auth: AuthState
  sites: Site[]
  currentSite: Site | null
  resourceTypes: ResourceType[]
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

// Tipos para configuración MFA
export interface MfaCredential {
  id: string
  userId: string
  type: 'totp' | 'webauthn'
  name: string
  isActive: boolean
  lastUsedAt?: string
  createdAt: string
}

export interface TotpSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface WebAuthnCredential {
  id: string
  publicKey: string
  counter: number
  deviceType: 'security_key' | 'platform' | 'cross_platform'
  transports: string[]
}