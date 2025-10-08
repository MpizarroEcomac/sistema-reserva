// === FIGMA MCP REFERENCE ===
// Aplicación principal basada en los diseños de Figma
// Servidor MCP: http://127.0.0.1:3845/mcp

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importar estilos principales
import './assets/styles/main.css'

console.log('🚀 Iniciando Sistema de Reservas...')

// Crear la aplicación Vue
const app = createApp(App)

// Configurar Pinia
const pinia = createPinia()
app.use(pinia)

// Configurar router
app.use(router)

// Manejo de errores global
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Vue instance:', instance)
  console.error('Error info:', info)
}

// Montear la aplicación
app.mount('#app')

console.log('✅ Sistema de Reservas iniciado correctamente!')
