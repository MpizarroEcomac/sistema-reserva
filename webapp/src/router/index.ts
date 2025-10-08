// === FIGMA MCP REFERENCE ===
// Router principal basado en la navegación de los diseños de Figma
// Servidor MCP: http://127.0.0.1:3845/mcp

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy loading de componentes para mejor performance
const DashboardLayout = () => import('@/components/layout/DashboardLayout.vue')
const AuthLayout = () => import('@/components/layout/AuthLayout.vue')

// Vistas de autenticación
const Login = () => import('@/views/auth/LoginView.vue')
const Register = () => import('@/views/auth/RegisterView.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPasswordView.vue')
const ResetPassword = () => import('@/views/auth/ResetPasswordView.vue')
const MfaSetup = () => import('@/views/auth/MfaSetupView.vue')
const MfaVerify = () => import('@/views/auth/MfaVerifyView.vue')

// Vistas principales
const Dashboard = () => import('@/views/dashboard/DashboardView.vue')
const ReservationCalendar = () => import('@/views/reservations/ReservationCalendarView.vue')
const MyBookings = () => import('@/views/reservations/MyBookingsView.vue')
const CreateBooking = () => import('@/views/reservations/CreateBookingView.vue')
const EditBooking = () => import('@/views/reservations/EditBookingView.vue')

// Vistas de administración
const AdminDashboard = () => import('@/views/admin/AdminDashboardView.vue')
const SiteManagement = () => import('@/views/admin/SiteManagementView.vue')
const ResourceManagement = () => import('@/views/admin/ResourceManagementView.vue')
const UserManagement = () => import('@/views/admin/UserManagementView.vue')
const ReportsView = () => import('@/views/admin/ReportsView.vue')
const RulesManagement = () => import('@/views/admin/RulesManagementView.vue')

// Vista de perfil
const ProfileView = () => import('@/views/ProfileView.vue')

// Vista de error 404
const NotFound = () => import('@/views/NotFoundView.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  
  // Rutas de autenticación (públicas)
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: {
          title: 'Iniciar Sesión',
          description: 'Accede a tu cuenta del sistema de reservas'
        }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: {
          title: 'Crear Cuenta',
          description: 'Regístrate en el sistema de reservas'
        }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
          title: 'Recuperar Contraseña',
          description: 'Solicita un enlace para restablecer tu contraseña'
        }
      },
      {
        path: 'reset-password/:token',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: 'Restablecer Contraseña',
          description: 'Establece una nueva contraseña para tu cuenta'
        }
      }
    ]
  },

  // Rutas de autenticación multifactor (requieren pre-autenticación)
  {
    path: '/mfa',
    component: AuthLayout,
    meta: { requiresPreAuth: true },
    children: [
      {
        path: 'setup',
        name: 'mfa-setup',
        component: MfaSetup,
        meta: {
          title: 'Configurar Autenticación Multifactor',
          description: 'Configura un método adicional de seguridad'
        }
      },
      {
        path: 'verify',
        name: 'mfa-verify',
        component: MfaVerify,
        meta: {
          title: 'Verificación MFA',
          description: 'Completa la autenticación multifactor'
        }
      }
    ]
  },

  // Rutas principales (requieren autenticación)
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Panel Principal',
          description: 'Vista general del sistema de reservas'
        }
      },
      
      // Perfil de usuario
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: {
          title: 'Mi Perfil',
          description: 'Gestiona tu información personal y configuración'
        }
      },

      // Reservas
      {
        path: '/reservations',
        name: 'reservations',
        children: [
          {
            path: '',
            redirect: '/reservations/calendar'
          },
          {
            path: 'calendar',
            name: 'reservation-calendar',
            component: ReservationCalendar,
            meta: {
              title: 'Calendario de Reservas',
              description: 'Visualiza la disponibilidad y gestiona reservas'
            }
          },
          {
            path: 'my-bookings',
            name: 'my-bookings',
            component: MyBookings,
            meta: {
              title: 'Mis Reservas',
              description: 'Gestiona tus reservas actuales y pasadas'
            }
          },
          {
            path: 'create',
            name: 'create-booking',
            component: CreateBooking,
            meta: {
              title: 'Nueva Reserva',
              description: 'Crea una nueva reserva de sala o estacionamiento'
            }
          },
          {
            path: 'edit/:id',
            name: 'edit-booking',
            component: EditBooking,
            meta: {
              title: 'Editar Reserva',
              description: 'Modifica los detalles de tu reserva'
            }
          }
        ]
      }
    ]
  },

  // Rutas de administración (requieren rol admin)
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { 
      requiresAuth: true,
      requiresRole: ['site_admin', 'super_admin']
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: {
          title: 'Panel de Administración',
          description: 'Gestión administrativa del sistema'
        }
      },
      {
        path: 'sites',
        name: 'admin-sites',
        component: SiteManagement,
        meta: {
          title: 'Gestión de Sedes',
          description: 'Administra las sedes de la empresa',
          requiresRole: ['super_admin'] // Solo super admin
        }
      },
      {
        path: 'resources',
        name: 'admin-resources',
        component: ResourceManagement,
        meta: {
          title: 'Gestión de Recursos',
          description: 'Administra salas, estacionamientos y otros recursos'
        }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UserManagement,
        meta: {
          title: 'Gestión de Usuarios',
          description: 'Administra usuarios y permisos del sistema'
        }
      },
      {
        path: 'rules',
        name: 'admin-rules',
        component: RulesManagement,
        meta: {
          title: 'Reglas de Negocio',
          description: 'Configura reglas de reservas y restricciones'
        }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: ReportsView,
        meta: {
          title: 'Reportes y Analíticas',
          description: 'Visualiza estadísticas y reportes de uso'
        }
      }
    ]
  },

  // Página de error 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Middleware de autenticación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} - Sistema de Reservas`
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirigir al login si no está autenticado
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // Verificar roles si son requeridos
    if (to.meta.requiresRole) {
      const requiredRoles = Array.isArray(to.meta.requiresRole) 
        ? to.meta.requiresRole 
        : [to.meta.requiresRole]
      
      if (!authStore.hasRole(requiredRoles)) {
        // Usuario sin permisos suficientes
        next({ name: 'dashboard' })
        return
      }
    }
  }

  // Verificar si la ruta requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  // Verificar si la ruta requiere pre-autenticación (para MFA)
  if (to.meta.requiresPreAuth) {
    // Aquí podrías verificar si el usuario tiene una sesión previa válida para MFA
    // Por ahora simplemente continúa
  }

  next()
})

// Error handler global
router.onError((error) => {
  console.error('Router error:', error)
})

export default router

// Tipos para el meta de las rutas
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiresPreAuth?: boolean
    requiresRole?: string | string[]
  }
}
