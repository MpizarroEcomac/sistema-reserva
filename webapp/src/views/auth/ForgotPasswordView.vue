<!-- === FIGMA MCP REFERENCE === -->
<!-- Vista de recuperación de contraseña basada en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Recuperar Contraseña
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </p>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="emailSent" class="rounded-md bg-success-50 p-4 mb-6 dark:bg-success-900/50">
      <div class="flex">
        <CheckCircleIcon class="h-5 w-5 text-success-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-success-800 dark:text-success-200">
            Correo enviado
          </h3>
          <div class="mt-2 text-sm text-success-700 dark:text-success-300">
            Hemos enviado un enlace de recuperación a {{ form.email }}. 
            Revisa tu bandeja de entrada y spam.
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
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

      <!-- Error general -->
      <div v-if="generalError" class="rounded-md bg-error-50 p-4 dark:bg-error-900/50">
        <div class="flex">
          <ExclamationCircleIcon class="h-5 w-5 text-error-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-error-800 dark:text-error-200">
              Error al enviar el correo
            </h3>
            <div class="mt-2 text-sm text-error-700 dark:text-error-300">
              {{ generalError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de envío -->
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
          {{ isLoading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
        </button>
      </div>
    </form>

    <!-- Acciones adicionales -->
    <div class="mt-6">
      <div v-if="emailSent" class="space-y-4">
        <button
          @click="resendEmail"
          :disabled="resendDisabled"
          class="btn-secondary w-full"
        >
          {{ resendDisabled ? `Reenviar en ${countdown}s` : 'Reenviar correo' }}
        </button>
      </div>

      <!-- Links de navegación -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ¿Recordaste tu contraseña?
          <router-link
            to="/auth/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Iniciar sesión
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

// Estado del componente
const isLoading = ref(false)
const emailSent = ref(false)
const generalError = ref<string | null>(null)
const errors = ref<Record<string, string[]>>({})

// Estados para reenvío
const resendDisabled = ref(false)
const countdown = ref(60)
let countdownTimer: number | null = null

// Formulario
const form = reactive({
  email: ''
})

// Métodos
const handleSubmit = async () => {
  isLoading.value = true
  generalError.value = null
  errors.value = {}

  try {
    await authStore.requestPasswordReset(form.email)
    emailSent.value = true
    startResendCountdown()
  } catch (error: any) {
    generalError.value = error.message
    errors.value = error.errors || {}
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  if (resendDisabled.value) return
  
  isLoading.value = true
  generalError.value = null

  try {
    await authStore.requestPasswordReset(form.email)
    startResendCountdown()
  } catch (error: any) {
    generalError.value = error.message
  } finally {
    isLoading.value = false
  }
}

const startResendCountdown = () => {
  resendDisabled.value = true
  countdown.value = 60

  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      resendDisabled.value = false
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

// Cleanup
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>