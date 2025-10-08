// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

// Site types
export interface Site {
  id: string;
  name: string;
  timezone: string;
  address?: string;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  resources?: Resource[];
  ruleSets?: RuleSet[];
}

// Resource types
export interface ResourceType {
  id: number;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  siteId: string;
  resourceTypeId: number;
  site?: Site;
  resourceType?: ResourceType;
  bookings?: Booking[];
}

// User types
export enum UserRole {
  USER = 'user',
  RECEPTION = 'reception',
  SITE_ADMIN = 'site_admin',
  GLOBAL_ADMIN = 'global_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  assignedSites?: string[];
  department?: string;
  position?: string;
  config?: Record<string, any>;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export enum BookingStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  timeRange: string;
  purpose: string;
  attendeeCount?: number;
  attendees?: string[];
  licensePlate?: string;
  status: BookingStatus;
  notes?: string;
  config?: Record<string, any>;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  resourceId: string;
  userId: number;
  createdById: number;
  resource?: Resource;
  user?: User;
  createdBy?: User;
}

// Rule types
export interface BookingRules {
  operatingHours: string[];
  minDuration: number;
  maxDuration: number;
  bufferTime: number;
  maxBookingsPerDay: number;
  maxBookingsPerWeek?: number;
  maxAdvanceBookingDays: number;
  minAdvanceBookingMinutes?: number;
  allowedWeekdays?: number[];
  requiresLicensePlate?: boolean;
  maxAttendees?: number;
  allowConcurrentBookings?: boolean;
  requiresApproval?: boolean;
  minCancellationMinutes?: number;
  allowModification?: boolean;
}

export interface RuleSet {
  id: number;
  name: string;
  description?: string;
  rules: BookingRules;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  siteId?: string;
  resourceTypeId?: number;
  site?: Site;
  resourceType?: ResourceType;
}

// Form types
export interface LoginData {
  email: string;
  password: string;
}

export interface BookingFormData {
  siteId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount?: number;
  attendees?: string[];
  licensePlate?: string;
  notes?: string;
}

// UI types
export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  booking?: Booking;
}

export interface AvailabilityData {
  site: Site;
  date: string;
  resources: Array<{
    resource: Resource;
    availability: TimeSlot[];
    bookings: Booking[];
  }>;
}

// Filter and pagination types
export interface Filters {
  siteId?: string;
  resourceType?: string;
  date?: string;
  status?: BookingStatus;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Auth types
export interface AuthUser extends User {
  // Additional auth-specific properties can go here
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Component props types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface CardProps extends BaseProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: boolean;
}

export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}