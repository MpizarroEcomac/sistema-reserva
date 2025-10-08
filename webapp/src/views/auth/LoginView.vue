<!-- === FIGMA MCP REFERENCE === -->
<!-- Vista de login basada en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Iniciar Sesión
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Accede a tu cuenta del sistema de reservas
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="form-label">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          class="form-input"
          :class="{
            'border-error-300 focus:border-error-500 focus:ring-error-500': errors.email
          }"
          placeholder="tu@email.com"
        >
        <p v-if="errors.email" class="form-error">
          {{ errors.email[0] }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="form-label">
          Contraseña
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            class="form-input pr-10"
            :class="{
              'border-error-300 focus:border-error-500 focus:ring-error-500': errors.password
            }"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            @click="showPassword = !showPassword"
          >
            <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <p v-if="errors.password" class="form-error">
          {{ errors.password[0] }}
        </p>
      </div>

      <!-- Recordar sesión -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember"
            v-model="form.remember"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="remember" class="ml-2 block text-sm text-gray-900 dark:text-white">
            Recordar sesión
          </label>
        </div>

        <div class="text-sm">
          <router-link
            to="/auth/forgot-password"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>
      </div>

      <!-- Error general -->
      <div v-if="generalError" class="rounded-md bg-error-50 p-4 dark:bg-error-900/50">
        <div class="flex">
          <ExclamationCircleIcon class="h-5 w-5 text-error-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-error-800 dark:text-error-200">
              Error al iniciar sesión
            </h3>
            <div class="mt-2 text-sm text-error-700 dark:text-error-300">
              {{ generalError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de login -->
      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </div>
    </form>

    <!-- Divider -->
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            O continúa con
          </span>
        </div>
      </div>
    </div>

    <!-- SSO Options -->
    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        @click="loginWithGoogle"
        type="button"
        class="btn-secondary"
        :disabled="isLoading"
      >
        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>

      <button
        @click="loginWithMicrosoft"
        type="button"
        class="btn-secondary"
        :disabled="isLoading"
      >
        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="#f25022" d="M1 1h10v10H1z"/>
          <path fill="#00a4ef" d="M13 1h10v10H13z"/>
          <path fill="#7fba00" d="M1 13h10v10H1z"/>
          <path fill="#ffb900" d="M13 13h10v10H13z"/>
        </svg>
        Microsoft
      </button>
    </div>

    <!-- Register link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes una cuenta?
        <router-link
          to="/auth/register"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Crear cuenta
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// Estado del componente
const isLoading = ref(false)
const showPassword = ref(false)
const generalError = ref<string | null>(null)
const errors = ref<Record<string, string[]>>({})

// Formulario
const form = reactive<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

// Métodos
const handleSubmit = async () => {
  isLoading.value = true
  generalError.value = null
  errors.value = {}

  try {
    await authStore.login(form)
    
    // Redirigir al dashboard o a la página solicitada
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  } catch (error: any) {
    generalError.value = error.message
    errors.value = error.errors || {}
  } finally {
    isLoading.value = false
  }
}

const loginWithGoogle = async () => {
  try {
    isLoading.value = true
    generalError.value = null
    
    // TODO: Implementar SSO con Google
    console.log('Login con Google')
    
    // Simulación temporal
    await new Promise(resolve => setTimeout(resolve, 1000))
    generalError.value = 'SSO aún no implementado'
  } catch (error: any) {
    generalError.value = error.message || 'Error al conectar con Google'
  } finally {
    isLoading.value = false
  }
}

const loginWithMicrosoft = async () => {
  try {
    isLoading.value = true
    generalError.value = null
    
    // TODO: Implementar SSO con Microsoft
    console.log('Login con Microsoft')
    
    // Simulación temporal
    await new Promise(resolve => setTimeout(resolve, 1000))
    generalError.value = 'SSO aún no implementado'
  } catch (error: any) {
    generalError.value = error.message || 'Error al conectar con Microsoft'
  } finally {
    isLoading.value = false
  }
}
</script>