// === FIGMA MCP REFERENCE ===
// Store de autenticación basado en diseños de Figma
// Servidor MCP: http://127.0.0.1:3845/mcp

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, AuthState, LoginCredentials, RegisterData, ApiResponse, ApiError } from '@/types'
// import { authApi } from '@/api/auth' // Comentado temporalmente

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters computados
  const isAuthenticated = computed(() => {
    return !!user.value && !!token.value
  })

  const userRole = computed(() => {
    return user.value?.role || null
  })

  const hasRole = computed(() => {
    return (role: string | string[]) => {
      if (!user.value) return false
      const userRole = user.value.role
      if (Array.isArray(role)) {
        return role.includes(userRole)
      }
      return userRole === role
    }
  })

  const canAccessAdmin = computed(() => {
    return hasRole.value(['site_admin', 'super_admin'])
  })

  const canManageAllSites = computed(() => {
    return hasRole.value('super_admin')
  })

  // Actions
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      // Mock de autenticación - Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validación simple mock
      if (credentials.email === 'admin@empresa.com' && credentials.password === 'admin123') {
        // Usuario administrador mock
        user.value = {
          id: '1',
          email: 'admin@empresa.com',
          name: 'Administrador Sistema',
          role: 'super_admin',
          avatar: undefined,
          emailVerifiedAt: new Date().toISOString(),
          mfaEnabled: false,
          lastLoginAt: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
        token.value = 'mock-admin-token-123'
      } else if (credentials.email === 'usuario@empresa.com' && credentials.password === 'user123') {
        // Usuario normal mock
        user.value = {
          id: '2',
          email: 'usuario@empresa.com',
          name: 'Usuario Normal',
          role: 'user',
          avatar: undefined,
          emailVerifiedAt: new Date().toISOString(),
          mfaEnabled: false,
          lastLoginAt: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
        token.value = 'mock-user-token-456'
      } else {
        throw new Error('Credenciales inválidas. Prueba: admin@empresa.com/admin123 o usuario@empresa.com/user123')
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', token.value)
      
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      // Mock registro - simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular registro exitoso
      console.log('Usuario registrado (mock):', data.email)
      
    } catch (err: any) {
      error.value = err.message || 'Error al registrar usuario'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      // Mock logout - simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (err) {
      console.warn('Error al cerrar sesión:', err)
    } finally {
      // Limpiar estado local
      user.value = null
      token.value = null
      error.value = null
      
      // Limpiar localStorage
      localStorage.removeItem('auth_token')
      
      isLoading.value = false
    }
  }

  const fetchUser = async (): Promise<void> => {
    if (!token.value) {
      user.value = null
      return
    }

    try {
      isLoading.value = true
      error.value = null

      // Mock fetchUser - recrear usuario basado en el token
      if (token.value === 'mock-admin-token-123') {
        user.value = {
          id: '1',
          email: 'admin@empresa.com',
          name: 'Administrador Sistema',
          role: 'super_admin',
          avatar: undefined,
          emailVerifiedAt: new Date().toISOString(),
          mfaEnabled: false,
          lastLoginAt: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
      } else if (token.value === 'mock-user-token-456') {
        user.value = {
          id: '2',
          email: 'usuario@empresa.com',
          name: 'Usuario Normal',
          role: 'user',
          avatar: undefined,
          emailVerifiedAt: new Date().toISOString(),
          mfaEnabled: false,
          lastLoginAt: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
      } else {
        // Token inválido
        await logout()
        throw new Error('Token inválido')
      }
    } catch (err: any) {
      // Token inválido o expirado
      await logout()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    // TODO: Implementar cuando se conecte con API real
    console.log('updateProfile (mock):', userData)
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    console.log('changePassword (mock)', { currentPassword: '***', newPassword: '***' })
  }

  const requestPasswordReset = async (email: string): Promise<void> => {
    // Mock request password reset
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Password reset requested (mock) for:', email)
  }

  const resetPassword = async (token: string, password: string, passwordConfirmation: string): Promise<void> => {
    console.log('resetPassword (mock)', { token, password: '***', passwordConfirmation: '***' })
  }

  const clearError = (): void => {
    error.value = null
  }

  // Inicializar store
  const initialize = async (): Promise<void> => {
    if (token.value) {
      try {
        await fetchUser()
      } catch (err) {
        // Token inválido, el usuario ya fue deslogueado
        console.warn('Token inválido durante inicialización')
      }
    }
  }

  // Auto-inicializar cuando se crea el store
  if (typeof window !== 'undefined' && token.value) {
    initialize()
  }

  return {
    // Estado
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    isAuthenticated,
    userRole,
    hasRole,
    canAccessAdmin,
    canManageAllSites,
    
    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    clearError,
    initialize,
  }
})