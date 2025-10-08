<!-- === FIGMA MCP REFERENCE === -->
<!-- Vista del dashboard principal basado en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header de bienvenida -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Bienvenido, {{ authStore.user?.name || 'Usuario' }}
      </h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Gestiona tus reservas y explora los recursos disponibles en {{ currentSite?.name || 'tu sede' }}
      </p>
    </div>

    <!-- Métricas rápidas -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Reservas activas -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarDaysIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Reservas Activas
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.activeBookings }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Próxima reserva -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-success-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Próxima Reserva
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ nextBookingTime }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Recursos disponibles -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BuildingOfficeIcon class="h-8 w-8 text-warning-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Recursos Disponibles
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.availableResources }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total de reservas -->
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-8 w-8 text-error-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Este Mes
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.monthlyBookings }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal en grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Panel principal - Acciones rápidas -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Acciones Rápidas
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Nueva reserva -->
              <router-link
                to="/reservations/create"
                class="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900">
                    <PlusCircleIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Nueva Reserva
                  </h3>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Reserva una sala o estacionamiento para tus reuniones o necesidades.
                  </p>
                </div>
              </router-link>

              <!-- Ver calendario -->
              <router-link
                to="/reservations/calendar"
                class="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-success-50 dark:bg-success-900/50 text-success-600 dark:text-success-400 group-hover:bg-success-100 dark:group-hover:bg-success-900">
                    <CalendarDaysIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Ver Calendario
                  </h3>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Explora la disponibilidad de recursos en tiempo real.
                  </p>
                </div>
              </router-link>

              <!-- Mis reservas -->
              <router-link
                to="/reservations/my-bookings"
                class="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-warning-50 dark:bg-warning-900/50 text-warning-600 dark:text-warning-400 group-hover:bg-warning-100 dark:group-hover:bg-warning-900">
                    <ClipboardDocumentListIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Mis Reservas
                  </h3>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Gestiona y modifica tus reservas existentes.
                  </p>
                </div>
              </router-link>

              <!-- Panel admin (solo para admins) -->
              <router-link
                v-if="authStore.canAccessAdmin"
                to="/admin"
                class="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-error-50 dark:bg-error-900/50 text-error-600 dark:text-error-400 group-hover:bg-error-100 dark:group-hover:bg-error-900">
                    <CogIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    Panel Admin
                  </h3>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Gestiona recursos, usuarios y configuración del sistema.
                  </p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar derecho -->
      <div class="space-y-6">
        <!-- Próximas reservas -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Próximas Reservas
            </h3>
          </div>
          <div class="card-body">
            <div v-if="upcomingBookings.length === 0" class="text-center py-6">
              <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Sin reservas próximas
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Crea tu primera reserva para comenzar.
              </p>
            </div>
            
            <div v-else class="flow-root">
              <ul role="list" class="-mb-8">
                <li v-for="(booking, index) in upcomingBookings" :key="booking.id">
                  <div class="relative pb-8">
                    <div v-if="index !== upcomingBookings.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    <div class="relative flex space-x-3">
                      <div>
                        <span :class="[getBookingStatusColor(booking.status), 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800']">
                          <CalendarIcon class="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div>
                          <div class="text-sm">
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ booking.title }}
                            </span>
                          </div>
                          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {{ formatBookingTime(booking.startAt, booking.endAt) }}
                          </p>
                          <p class="text-xs text-gray-400 dark:text-gray-500">
                            {{ booking.resource?.name }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Recursos más utilizados -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Recursos Populares
            </h3>
          </div>
          <div class="card-body">
            <div class="space-y-3">
              <div v-for="resource in popularResources" :key="resource.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <BuildingOfficeIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ resource.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ resource.type }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ resource.usage }}% ocupación
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

// Estado local
const stats = ref({
  activeBookings: 3,
  availableResources: 12,
  monthlyBookings: 18,
})

const upcomingBookings = ref([
  {
    id: '1',
    title: 'Reunión Equipo Marketing',
    startAt: '2024-01-08T14:00:00Z',
    endAt: '2024-01-08T15:30:00Z',
    status: 'confirmed',
    resource: { name: 'Sala de Juntas A' }
  },
  {
    id: '2',
    title: 'Presentación Cliente',
    startAt: '2024-01-09T10:00:00Z',
    endAt: '2024-01-09T12:00:00Z',
    status: 'pending',
    resource: { name: 'Sala de Conferencias' }
  }
])

const popularResources = ref([
  { id: '1', name: 'Sala de Juntas A', type: 'Sala', usage: 85 },
  { id: '2', name: 'Estacionamiento P01', type: 'Parking', usage: 72 },
  { id: '3', name: 'Sala Creativa', type: 'Sala', usage: 68 },
])

// Computed
const currentSite = computed(() => {
  // TODO: Obtener de un store de sitios
  return { name: 'Santiago' }
})

const nextBookingTime = computed(() => {
  if (upcomingBookings.value.length === 0) {
    return 'Sin reservas'
  }
  
  const nextBooking = upcomingBookings.value[0]
  if (!nextBooking || !nextBooking.startAt) {
    return 'Sin reservas'
  }
  
  const startTime = new Date(nextBooking.startAt)
  return startTime.toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Métodos
const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-success-500'
    case 'pending':
      return 'bg-warning-500'
    case 'cancelled':
      return 'bg-error-500'
    default:
      return 'bg-gray-500'
  }
}

const formatBookingTime = (startAt: string, endAt: string) => {
  const start = new Date(startAt)
  const end = new Date(endAt)
  
  const startFormatted = start.toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const endFormatted = end.toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return `${startFormatted} - ${endFormatted}`
}

// Lifecycle
onMounted(() => {
  // TODO: Cargar datos reales desde API
  console.log('Dashboard cargado para usuario:', authStore.user?.name)
})
</script>