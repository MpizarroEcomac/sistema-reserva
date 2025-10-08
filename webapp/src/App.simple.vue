<template>
  <div style="padding: 2rem; font-family: Arial, sans-serif; background: #f0f9ff; min-height: 100vh;">
    <div style="max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h1 style="color: #1e40af; margin-bottom: 1rem; font-size: 2rem;">🚀 Sistema de Reservas</h1>
      
      <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
        <h2 style="color: #15803d; margin: 0 0 0.5rem 0; font-size: 1.2rem;">✅ Aplicación funcionando correctamente</h2>
        <p style="color: #166534; margin: 0; font-size: 0.95rem;">Vue 3 + Vite está corriendo sin problemas en el puerto {{ port }}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 1rem; border-radius: 6px;">
          <h3 style="color: #1d4ed8; margin: 0 0 0.5rem 0;">🔧 Estado del Sistema</h3>
          <ul style="color: #1e40af; margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
            <li>Vue 3: ✅ Activo</li>
            <li>Router: ✅ Funcionando</li>
            <li>Build: ✅ Compilado</li>
            <li>HMR: ✅ Disponible</li>
          </ul>
        </div>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 1rem; border-radius: 6px;">
          <h3 style="color: #d97706; margin: 0 0 0.5rem 0;">⚡ Información Técnica</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
            <li>Framework: Vue 3</li>
            <li>Build Tool: Vite</li>
            <li>TypeScript: ✅</li>
            <li>Puerto: {{ port }}</li>
          </ul>
        </div>
      </div>

      <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 6px; border-left: 4px solid #6366f1;">
        <h3 style="color: #4338ca; margin: 0 0 1rem 0;">📝 Siguiente Paso</h3>
        <p style="color: #374151; margin: 0; line-height: 1.5;">
          Si puedes ver este mensaje, significa que la aplicación Vue está funcionando correctamente. 
          Ahora podemos proceder a cargar los componentes completos del sistema de reservas.
        </p>
      </div>

      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0; text-align: center; font-size: 0.875rem;">
          🕐 {{ currentTime }} - Sistema de Reservas Multi-Sede
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const port = ref('3000')
const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('es-ES')
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>