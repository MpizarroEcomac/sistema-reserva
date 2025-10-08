<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-primary-600">404</h1>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Página no encontrada
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
      </div>
      <div class="space-y-4">
        <router-link to="/dashboard" class="btn-primary">
          Ir al Dashboard
        </router-link>
        <br>
        <router-link to="/auth/login" class="btn-secondary">
          Iniciar Sesión
        </router-link>
      </div>
    </div>
  </div>
</template>
