<!-- === FIGMA MCP REFERENCE === -->
<!-- Layout de autenticación basado en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Panel izquierdo con información de la empresa -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
      <!-- Patrón de fondo decorativo -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
      <div class="absolute inset-0 bg-black opacity-20"></div>
      
      <!-- Patrón geométrico de fondo -->
      <svg class="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" class="text-primary-500" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
      </svg>
      
      <!-- Contenido del panel izquierdo -->
      <div class="relative z-10 flex flex-col justify-center px-8 lg:px-12">
        <!-- Logo de la empresa -->
        <div class="mb-8">
          <div class="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">SR</span>
          </div>
        </div>
        
        <!-- Contenido informativo -->
        <div class="max-w-md">
          <h1 class="text-3xl font-bold text-white mb-6">
            Sistema de Reservas Multi-Sede
          </h1>
          <p class="text-lg text-primary-100 mb-8">
            Gestiona salas de reuniones y estacionamientos de manera eficiente 
            en todas nuestras sedes corporativas.
          </p>
          
          <!-- Características destacadas -->
          <div class="space-y-4">
            <div class="flex items-center text-primary-100">
              <CheckCircleIcon class="h-5 w-5 text-primary-200 mr-3" />
              <span>Reservas en tiempo real</span>
            </div>
            <div class="flex items-center text-primary-100">
              <CheckCircleIcon class="h-5 w-5 text-primary-200 mr-3" />
              <span>Múltiples sedes disponibles</span>
            </div>
            <div class="flex items-center text-primary-100">
              <CheckCircleIcon class="h-5 w-5 text-primary-200 mr-3" />
              <span>Notificaciones automáticas</span>
            </div>
            <div class="flex items-center text-primary-100">
              <CheckCircleIcon class="h-5 w-5 text-primary-200 mr-3" />
              <span>Seguridad avanzada MFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Panel derecho con formularios -->
    <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <!-- Logo móvil -->
        <div class="lg:hidden text-center mb-8">
          <div class="h-12 w-12 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span class="text-white font-bold text-xl">SR</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Sistema de Reservas
          </h2>
        </div>
        
        <!-- Slot para el contenido de cada vista -->
        <RouterView />
        
        <!-- Footer con información adicional -->
        <div class="mt-8 text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>&copy; {{ currentYear }} Empresa. Todos los derechos reservados.</p>
          </div>
          
          <!-- Enlaces de ayuda -->
          <div class="flex justify-center space-x-6 text-sm">
            <a 
              href="#" 
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              @click.prevent="openSupportModal"
            >
              Soporte
            </a>
            <a 
              href="#" 
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              @click.prevent="openPrivacyModal"
            >
              Privacidad
            </a>
            <a 
              href="#" 
              class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              @click.prevent="openTermsModal"
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Métodos
const openSupportModal = () => {
  // TODO: Implementar modal de soporte
  console.log('Abrir modal de soporte')
}

const openPrivacyModal = () => {
  // TODO: Implementar modal de privacidad
  console.log('Abrir modal de privacidad')
}

const openTermsModal = () => {
  // TODO: Implementar modal de términos
  console.log('Abrir modal de términos')
}
</script>