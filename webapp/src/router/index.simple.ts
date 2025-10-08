import { createRouter, createWebHistory } from 'vue-router'

// Componente de prueba simple
const TestComponent = {
  template: `
    <div style="padding: 2rem; font-family: Arial, sans-serif;">
      <h1 style="color: #333; margin-bottom: 1rem;">¡Aplicación Vue funcionando!</h1>
      <p style="color: #666; margin-bottom: 1rem;">El servidor de desarrollo está corriendo correctamente.</p>
      <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; border: 1px solid #0ea5e9;">
        <h2 style="color: #0284c7; margin: 0 0 0.5rem 0;">Estado del Sistema</h2>
        <ul style="color: #0369a1; margin: 0; padding-left: 1.5rem;">
          <li>✅ Vue 3 cargado</li>
          <li>✅ Router funcionando</li>
          <li>✅ Aplicación renderizada</li>
        </ul>
      </div>
      <p style="color: #666; margin-top: 1rem; font-size: 0.9rem;">
        Si ves este mensaje, la aplicación base está funcionando correctamente.
      </p>
    </div>
  `
}

const routes = [
  {
    path: '/',
    name: 'test',
    component: TestComponent
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router