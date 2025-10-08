<!-- === FIGMA MCP REFERENCE === -->
<!-- Layout del dashboard basado en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo y título -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="h-8 w-8 bg-primary-600 rounded-lg mr-3 flex items-center justify-center">
            <span class="text-white font-bold text-sm">SR</span>
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            Reservas
          </h1>
        </div>
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Navegación principal -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <!-- Dashboard -->
        <router-link
          to="/dashboard"
          class="nav-item"
          :class="{ 'nav-item-active': $route.name === 'dashboard' }"
        >
          <HomeIcon class="nav-icon" />
          Dashboard
        </router-link>

        <!-- Reservas -->
        <div class="nav-section">
          <div class="nav-section-title">Reservas</div>
          <router-link
            to="/reservations/calendar"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'reservation-calendar' }"
          >
            <CalendarDaysIcon class="nav-icon" />
            Calendario
          </router-link>
          <router-link
            to="/reservations/my-bookings"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'my-bookings' }"
          >
            <ClipboardDocumentListIcon class="nav-icon" />
            Mis Reservas
          </router-link>
          <router-link
            to="/reservations/create"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'create-booking' }"
          >
            <PlusCircleIcon class="nav-icon" />
            Nueva Reserva
          </router-link>
        </div>

        <!-- Administración (solo para admins) -->
        <div v-if="authStore.canAccessAdmin" class="nav-section">
          <div class="nav-section-title">Administración</div>
          <router-link
            to="/admin"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'admin-dashboard' }"
          >
            <ChartBarIcon class="nav-icon" />
            Panel Admin
          </router-link>
          <router-link
            to="/admin/resources"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'admin-resources' }"
          >
            <BuildingOfficeIcon class="nav-icon" />
            Recursos
          </router-link>
          <router-link
            to="/admin/users"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'admin-users' }"
          >
            <UsersIcon class="nav-icon" />
            Usuarios
          </router-link>
          <router-link
            v-if="authStore.canManageAllSites"
            to="/admin/sites"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'admin-sites' }"
          >
            <MapPinIcon class="nav-icon" />
            Sedes
          </router-link>
          <router-link
            to="/admin/reports"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'admin-reports' }"
          >
            <DocumentChartBarIcon class="nav-icon" />
            Reportes
          </router-link>
        </div>
      </nav>

      <!-- Usuario y configuración -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div 
              v-if="!authStore.user?.avatar"
              class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center"
            >
              <span class="text-white font-medium text-xs">
                {{ getInitials(authStore.user?.name) }}
              </span>
            </div>
            <img
              v-else
              :src="authStore.user?.avatar"
              :alt="authStore.user?.name"
              class="h-8 w-8 rounded-full object-cover"
              @error="setDefaultAvatar"
            >
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
        
        <div class="mt-3 space-y-1">
          <router-link
            to="/profile"
            class="nav-item text-sm"
          >
            <UserCircleIcon class="nav-icon h-4 w-4" />
            Mi Perfil
          </router-link>
          <button
            @click="logout"
            class="nav-item text-sm w-full text-left"
          >
            <ArrowRightOnRectangleIcon class="nav-icon h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para móvil -->
    <div 
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Contenido principal -->
    <div class="lg:ml-64">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div class="flex items-center">
            <!-- Botón menú móvil -->
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
            
            <!-- Breadcrumb -->
            <nav class="ml-4 lg:ml-0">
              <ol class="flex items-center space-x-2">
                <li v-for="(crumb, index) in breadcrumbs" :key="index">
                  <div class="flex items-center">
                    <ChevronRightIcon v-if="index > 0" class="h-4 w-4 text-gray-400 mx-2" />
                    <span 
                      :class="[
                        'text-sm',
                        index === breadcrumbs.length - 1 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      ]"
                    >
                      {{ crumb.name }}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <!-- Acciones del header -->
          <div class="flex items-center space-x-4">
            <!-- Selector de sede (si hay múltiples) -->
            <div v-if="sites.length > 1" class="relative">
              <select 
                v-model="selectedSiteId"
                @change="changeSite"
                class="form-input pr-8"
              >
                <option v-for="site in sites" :key="site.id" :value="site.id">
                  {{ site.name }}
                </option>
              </select>
            </div>

            <!-- Notificaciones -->
            <button
              type="button"
              class="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <BellIcon class="h-6 w-6" />
              <span 
                v-if="unreadNotifications > 0"
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-400 ring-2 ring-white dark:ring-gray-800"
              ></span>
            </button>

            <!-- Toggle modo oscuro -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SunIcon v-if="isDarkMode" class="h-6 w-6" />
              <MoonIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <!-- Contenido de la página -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  MapPinIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  BellIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

// Stores
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Estado local
const sidebarOpen = ref(false)
const selectedSiteId = ref('SCL') // Por defecto Santiago
const sites = ref([
  { id: 'SCL', name: 'Santiago', code: 'SCL' },
  { id: 'LSC', name: 'La Serena', code: 'LSC' }
])

// Computed
const breadcrumbs = computed(() => {
  const crumbs: Array<{ name: string; path: string }> = []
  const matched = route.matched.filter(r => r.name)
  
  matched.forEach(match => {
    if (match.meta?.title) {
      crumbs.push({
        name: match.meta.title as string,
        path: match.path
      })
    }
  })
  
  return crumbs
})

const unreadNotifications = computed(() => {
  // TODO: Implementar conteo de notificaciones no leídas
  return 0
})

const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// Métodos
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const setDefaultAvatar = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const getInitials = (name?: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const changeSite = () => {
  // TODO: Implementar cambio de sede
  console.log('Cambiar sede a:', selectedSiteId.value)
}

const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.contains('dark')
  if (isDark) {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'light')
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'dark')
  }
}

// Cerrar sidebar al cambiar de ruta en móvil
router.afterEach(() => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})

onMounted(() => {
  // Ajustar sidebar según el tamaño de pantalla
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  handleResize()
})
</script>

<style scoped>
.nav-item {
  @apply group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-150;
}

.nav-item-active {
  @apply bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300;
}

.nav-icon {
  @apply mr-3 h-5 w-5 flex-shrink-0;
}

.nav-section {
  @apply mt-6;
}

.nav-section-title {
  @apply px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2;
}
</style>