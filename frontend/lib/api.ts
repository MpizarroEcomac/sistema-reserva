import axios from 'axios';

// Configuración base de la API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí podrías agregar tokens de autenticación
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ================================
// TIPOS DE DATOS
// ================================

export interface Site {
  id: string;
  name: string;
  timezone: string;
  address?: string;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

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
  siteId: string;
  resourceTypeId: number;
  site?: Site;
  resourceType?: ResourceType;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  bookingId?: number;
}

export interface ResourceAvailability {
  resource: Resource;
  date: string;
  timeSlots: TimeSlot[];
}

// ================================
// API FUNCTIONS - SITES
// ================================

export const sitesApi = {
  // Obtener todas las sedes
  getAll: async (includeInactive = false): Promise<Site[]> => {
    const response = await api.get('/sites', {
      params: { includeInactive },
    });
    return response.data;
  },

  // Obtener sede por ID
  getById: async (id: string): Promise<Site> => {
    const response = await api.get(`/sites/${id}`);
    return response.data;
  },

  // Obtener disponibilidad de una sede
  getAvailability: async (id: string, date: string): Promise<any> => {
    const response = await api.get(`/sites/${id}/availability`, {
      params: { date },
    });
    return response.data;
  },

  // Obtener estadísticas de una sede
  getStats: async (id: string): Promise<any> => {
    const response = await api.get(`/sites/${id}/stats`);
    return response.data;
  },
};

// ================================
// API FUNCTIONS - RESOURCES
// ================================

export const resourcesApi = {
  // Obtener todos los recursos
  getAll: async (params?: {
    siteId?: string;
    resourceTypeId?: number;
  }): Promise<Resource[]> => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  // Obtener recurso por ID
  getById: async (id: string): Promise<Resource> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Obtener tipos de recursos
  getTypes: async (): Promise<ResourceType[]> => {
    const response = await api.get('/resources/types');
    return response.data;
  },

  // Obtener recursos por tipo
  getByType: async (typeCode: string): Promise<Resource[]> => {
    const response = await api.get(`/resources/by-type/${typeCode}`);
    return response.data;
  },

  // Obtener disponibilidad de un recurso
  getAvailability: async (
    id: string,
    date: string
  ): Promise<ResourceAvailability> => {
    const response = await api.get(`/resources/${id}/availability`, {
      params: { date },
    });
    return response.data;
  },
};

// ================================
// API FUNCTIONS - BOOKINGS
// ================================

export interface CreateBookingRequest {
  resourceId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount?: number;
  attendees?: string[];
  licensePlate?: string;
  notes?: string;
}

export interface Booking {
  id: number;
  resourceId: string;
  userId: number;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount?: number;
  attendees?: string[];
  licensePlate?: string;
  status: 'active' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  config?: Record<string, any>;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  resource?: Resource;
}

export const bookingsApi = {
  // Crear nueva reserva
  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Obtener reservas del usuario
  getMyBookings: async (userId?: number): Promise<Booking[]> => {
    const response = await api.get('/bookings', {
      params: { userId },
    });
    return response.data;
  },

  // Obtener reserva por ID
  getById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Actualizar reserva
  update: async (id: number, data: Partial<CreateBookingRequest>): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },

  // Cancelar reserva
  cancel: async (id: number, reason?: string): Promise<void> => {
    await api.patch(`/bookings/${id}/cancel`, { reason });
  },
};

// ================================
// UTILITY FUNCTIONS
// ================================

// Formatear fecha para la API (YYYY-MM-DD)
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Formatear tiempo para la API (HH:mm)
export const formatTimeForAPI = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

// Combinar fecha y hora para crear Date object
export const combineDateAndTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}:00.000Z`);
};

// Convertir minutos a formato HH:mm
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Convertir tiempo HH:mm a minutos
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export default api;