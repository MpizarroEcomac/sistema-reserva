<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Panel de Administración
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">Gestión de Sedes</h3>
        </div>
        <div class="card-body">
          <p class="text-gray-500">Administra las sedes corporativas</p>
          <router-link to="/admin/sites" class="btn-primary mt-4">
            Gestionar Sedes
          </router-link>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">Recursos</h3>
        </div>
        <div class="card-body">
          <p class="text-gray-500">Gestiona salas y estacionamientos</p>
          <router-link to="/admin/resources" class="btn-primary mt-4">
            Gestionar Recursos
          </router-link>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">Usuarios</h3>
        </div>
        <div class="card-body">
          <p class="text-gray-500">Administra usuarios del sistema</p>
          <router-link to="/admin/users" class="btn-primary mt-4">
            Gestionar Usuarios
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>