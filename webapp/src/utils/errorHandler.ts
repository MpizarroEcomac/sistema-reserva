import axios, { AxiosError } from 'axios'
import type { ApiError } from '@/types'

// Configuración global de Axios
export const setupAxiosInterceptors = () => {
  // Request interceptor para agregar token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor para manejo de errores
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError = handleApiError(error)
      
      // Manejo específico según el código de error
      switch (apiError.status) {
        case 401:
          // Token expirado o inválido
          handleUnauthorized()
          break
        case 403:
          // Sin permisos
          showErrorNotification('No tienes permisos para realizar esta acción')
          break
        case 404:
          // Recurso no encontrado
          showErrorNotification('El recurso solicitado no fue encontrado')
          break
        case 422:
          // Errores de validación - no mostrar notificación global
          break
        case 429:
          // Rate limiting
          showErrorNotification('Demasiadas peticiones. Intenta nuevamente en unos minutos')
          break
        case 500:
          // Error del servidor
          showErrorNotification('Error interno del servidor. Contacta al administrador')
          break
        default:
          if (apiError.status >= 500) {
            showErrorNotification('Error del servidor. Intenta nuevamente')
          }
      }
      
      return Promise.reject(apiError)
    }
  )
}

// Función para manejar errores de API y convertirlos al formato estándar
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Error de respuesta del servidor
    const data = error.response.data as any
    return {
      message: data.message || getDefaultErrorMessage(error.response.status),
      errors: data.errors || {},
      status: error.response.status
    }
  } else if (error.request) {
    // Error de red
    return {
      message: 'Error de conexión. Verifica tu conexión a internet',
      errors: {},
      status: 0
    }
  } else {
    // Error en la configuración de la petición
    return {
      message: error.message || 'Error inesperado',
      errors: {},
      status: 0
    }
  }
}

// Mensajes de error por defecto según el código HTTP
const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Petición inválida'
    case 401:
      return 'No autorizado'
    case 403:
      return 'Acceso denegado'
    case 404:
      return 'Recurso no encontrado'
    case 409:
      return 'Conflicto en los datos'
    case 422:
      return 'Datos de validación incorrectos'
    case 429:
      return 'Demasiadas peticiones'
    case 500:
      return 'Error interno del servidor'
    case 502:
      return 'Servidor no disponible'
    case 503:
      return 'Servicio temporalmente no disponible'
    case 504:
      return 'Tiempo de espera agotado'
    default:
      return 'Error inesperado'
  }
}

// Manejo de errores de autenticación
const handleUnauthorized = () => {
  // Limpiar token y redirigir al login
  localStorage.removeItem('auth_token')
  delete axios.defaults.headers.common['Authorization']
  
  // Solo redirigir si no estamos ya en páginas de auth
  if (!window.location.pathname.startsWith('/auth')) {
    window.location.href = '/auth/login?reason=token_expired'
  }
}

// Sistema de notificaciones de error
let showErrorNotification: (message: string) => void = (message) => {
  console.error('Error:', message)
}

// Configurar la función de notificación (debe ser llamada desde el componente principal)
export const setErrorNotificationHandler = (handler: (message: string) => void) => {
  showErrorNotification = handler
}

// Clases de error personalizadas
export class ValidationError extends Error {
  public errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexión') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'No autorizado') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Acceso denegado') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Recurso no encontrado') {
    super(message)
    this.name = 'NotFoundError'
  }
}

// Utilidad para logging de errores
export const logError = (error: Error, context?: string, metadata?: any) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    metadata,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }

  // En desarrollo, mostrar en consola
  if (import.meta.env.DEV) {
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`)
    console.error(error)
    if (metadata) {
      console.table(metadata)
    }
    console.groupEnd()
  }

  // En producción, enviar a servicio de monitoreo (ej: Sentry)
  if (import.meta.env.PROD) {
    // TODO: Integrar con Sentry u otro servicio de monitoreo
    console.error('Error logged:', errorInfo)
  }
}

// Wrapper para manejo seguro de funciones async
export const safeAsync = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error as Error, context, { args })
      throw error
    }
  }
}

// Hook para manejo de errores en componentes
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string, metadata?: any) => {
    logError(error, context, metadata)
    
    if (error instanceof ValidationError) {
      // Los errores de validación se manejan en el componente
      return
    }
    
    if (error instanceof NetworkError) {
      showErrorNotification('Error de conexión. Verifica tu conexión a internet')
      return
    }
    
    if (error instanceof UnauthorizedError) {
      handleUnauthorized()
      return
    }
    
    if (error instanceof ForbiddenError) {
      showErrorNotification('No tienes permisos para realizar esta acción')
      return
    }
    
    if (error instanceof NotFoundError) {
      showErrorNotification('El recurso solicitado no fue encontrado')
      return
    }
    
    // Error genérico
    showErrorNotification('Ha ocurrido un error inesperado')
  }

  return { handleError }
}