// === FIGMA MCP REFERENCE ===
// Cliente API de autenticación basado en los diseños de Figma
// Servidor MCP: http://127.0.0.1:3845/mcp

import axios, { type AxiosResponse } from 'axios'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ApiResponse,
  ApiError
} from '@/types'

// Configurar axios
const apiClient = axios.create({
  baseURL: '/api', // Proxy configurado en vite.config.ts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true, // Para cookies de Laravel Sanctum
})

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Error de conexión',
      errors: error.response?.data?.errors || {},
      status: error.response?.status || 500
    }
    
    // Si el token es inválido, limpiar localStorage
    if (apiError.status === 401) {
      localStorage.removeItem('auth_token')
      delete apiClient.defaults.headers.common['Authorization']
    }
    
    return Promise.reject(apiError)
  }
)

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authApi = {
  // Obtener el token CSRF (necesario para Sanctum)
  async getCsrfToken(): Promise<void> {
    await apiClient.get('/sanctum/csrf-cookie')
  },

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<ApiResponse<{
    user: User
    token: string
    expires_in: number
  }>> {
    // Obtener token CSRF primero
    await this.getCsrfToken()
    
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Registrar nuevo usuario
  async register(data: RegisterData): Promise<ApiResponse<{
    user: User
    message: string
  }>> {
    await this.getCsrfToken()
    
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  // Cerrar sesión
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  // Obtener usuario autenticado
  async me(): Promise<ApiResponse<User>> {
    const response = await apiClient.get('/me')
    return response.data
  },

  // Actualizar perfil
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.patch('/me', userData)
    return response.data
  },

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.patch('/me/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword
    })
    return response.data
  },

  // Solicitar recuperación de contraseña
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    await this.getCsrfToken()
    
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  },

  // Restablecer contraseña
  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<ApiResponse<{ message: string }>> {
    await this.getCsrfToken()
    
    const response = await apiClient.post('/auth/reset-password', {
      token,
      email: '', // Se extraerá del token en el backend
      password,
      password_confirmation: passwordConfirmation
    })
    return response.data
  },

  // Verificar email
  async verifyEmail(id: string, hash: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.get(`/email/verify/${id}/${hash}`)
    return response.data
  },

  // Reenviar verificación de email
  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post('/email/verification-notification')
    return response.data
  },

  // === AUTENTICACIÓN MULTIFACTOR ===

  // Configurar TOTP
  async setupTotp(): Promise<ApiResponse<{
    secret: string
    qr_code: string
    backup_codes: string[]
  }>> {
    const response = await apiClient.post('/mfa/totp/setup')
    return response.data
  },

  // Verificar TOTP
  async verifyTotp(code: string): Promise<ApiResponse<{
    message: string
    backup_codes?: string[]
  }>> {
    const response = await apiClient.post('/mfa/totp/verify', { code })
    return response.data
  },

  // Desactivar TOTP
  async disableTotp(password: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete('/mfa/totp', {
      data: { password }
    })
    return response.data
  },

  // Obtener opciones de registro WebAuthn
  async getWebAuthnRegisterOptions(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/mfa/webauthn/register/options')
    return response.data
  },

  // Verificar registro WebAuthn
  async verifyWebAuthnRegister(credential: any): Promise<ApiResponse<{
    message: string
    credential_id: string
  }>> {
    const response = await apiClient.post('/mfa/webauthn/register/verify', credential)
    return response.data
  },

  // Obtener opciones de autenticación WebAuthn
  async getWebAuthnAuthOptions(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/mfa/webauthn/auth/options')
    return response.data
  },

  // Verificar autenticación WebAuthn
  async verifyWebAuthnAuth(credential: any): Promise<ApiResponse<{
    message: string
  }>> {
    const response = await apiClient.post('/mfa/webauthn/auth/verify', credential)
    return response.data
  },

  // === OAUTH SSO ===

  // Obtener URL de redirección para Google
  async getGoogleAuthUrl(): Promise<ApiResponse<{ url: string }>> {
    const response = await apiClient.get('/auth/redirect/google')
    return response.data
  },

  // Obtener URL de redirección para Microsoft
  async getMicrosoftAuthUrl(): Promise<ApiResponse<{ url: string }>> {
    const response = await apiClient.get('/auth/redirect/microsoft')
    return response.data
  },

  // Manejar callback de OAuth
  async handleOAuthCallback(provider: 'google' | 'microsoft', code: string, state?: string): Promise<ApiResponse<{
    user: User
    token: string
    expires_in: number
  }>> {
    const response = await apiClient.post(`/auth/callback/${provider}`, {
      code,
      state
    })
    return response.data
  }
}

export default apiClient