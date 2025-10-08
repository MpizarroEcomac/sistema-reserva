import { createApp } from 'vue'
import App from './App.simple.vue'

console.log('🚀 Iniciando aplicación Vue...')

const app = createApp(App)

app.mount('#app')

console.log('✅ Aplicación Vue montada exitosamente!')