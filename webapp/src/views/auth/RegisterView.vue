<!-- === FIGMA MCP REFERENCE === -->
<!-- Vista de registro basada en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->

<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Crear Cuenta
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Regístrate en el sistema de reservas
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nombre completo -->
      <div>
        <label for="name" class="form-label">
          Nombre completo
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          required
          class="form-input"
          :class="{
            'border-error-300 focus:border-error-500 focus:ring-error-500': errors.name
          }"
          placeholder="Tu nombre completo"
        >
        <p v-if="errors.name" class="form-error">
          {{ errors.name[0] }}
        </p>
      </div>

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
            autocomplete="new-password"
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

      <!-- Confirmar Password -->
      <div>
        <label for="passwordConfirmation" class="form-label">
          Confirmar contraseña
        </label>
        <div class="relative">
          <input
            id="passwordConfirmation"
            v-model="form.passwordConfirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            autocomplete="new-password"
            required
            class="form-input pr-10"
            :class="{
              'border-error-300 focus:border-error-500 focus:ring-error-500': errors.passwordConfirmation
            }"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            @click="showPasswordConfirmation = !showPasswordConfirmation"
          >
            <EyeIcon v-if="showPasswordConfirmation" class="h-5 w-5 text-gray-400" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <p v-if="errors.passwordConfirmation" class="form-error">
          {{ errors.passwordConfirmation[0] }}
        </p>
        <p v-else-if="form.password && form.passwordConfirmation && form.password !== form.passwordConfirmation" class="form-error">
          Las contraseñas no coinciden
        </p>
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-center">
        <input
          id="acceptTerms"
          v-model="form.acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="acceptTerms" class="ml-2 block text-sm text-gray-900 dark:text-white">
          Acepto los 
          <a href="#" class="text-primary-600 hover:text-primary-500">términos y condiciones</a>
          y la 
          <a href="#" class="text-primary-600 hover:text-primary-500">política de privacidad</a>
        </label>
      </div>

      <!-- Error general -->
      <div v-if="generalError" class="rounded-md bg-error-50 p-4 dark:bg-error-900/50">
        <div class="flex">
          <ExclamationCircleIcon class="h-5 w-5 text-error-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-error-800 dark:text-error-200">
              Error al crear cuenta
            </h3>
            <div class="mt-2 text-sm text-error-700 dark:text-error-300">
              {{ generalError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de registro -->
      <div>
        <button
          type="submit"
          :disabled="isLoading || !form.acceptTerms || form.password !== form.passwordConfirmation"
          class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </div>
    </form>

    <!-- Login link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes una cuenta?
        <router-link
          to="/auth/login"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Iniciar sesión
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
import type { RegisterData } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// Estado del componente
const isLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const generalError = ref<string | null>(null)
const errors = ref<Record<string, string[]>>({})

// Formulario
const form = reactive<RegisterData & { acceptTerms: boolean }>({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
})

// Métodos
const handleSubmit = async () => {
  if (form.password !== form.passwordConfirmation) {
    errors.value = { passwordConfirmation: ['Las contraseñas no coinciden'] }
    return
  }

  isLoading.value = true
  generalError.value = null
  errors.value = {}

  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation
    })
    
    // Redirigir al login con mensaje de éxito
    router.push({ 
      name: 'login', 
      query: { 
        message: 'Cuenta creada exitosamente. Por favor inicia sesión.' 
      } 
    })
  } catch (error: any) {
    generalError.value = error.message
    errors.value = error.errors || {}
  } finally {
    isLoading.value = false
  }
}
</script>