# 🎨 Frontend - Sistema de Reservas Multi-Sede

Frontend moderno desarrollado con **Vue 3**, **TypeScript**, **Tailwind CSS** y **Flowbite** para el sistema de reservas corporativo.

## 🚀 Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build

# Verificación de tipos
npm run type-check

# Linting
npm run lint
```

## 🏗️ Stack Tecnológico

- **Vue 3** (Composition API) - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos utility-first
- **Flowbite** - Componentes UI basados en Tailwind
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento con guards
- **VeeValidate + Yup** - Validación de formularios
- **Heroicons** - Iconografía
- **Axios** - Cliente HTTP

## 🎯 Características Implementadas

### ✅ Autenticación Completa
- Login/Registro con validación
- Recuperación de contraseña
- Autenticación Multi-Factor (TOTP + WebAuthn)
- SSO con Google y Microsoft (preparado)
- Gestión de sesiones segura

### ✅ Interfaz Responsive
- Diseño mobile-first
- Sidebar colapsable
- Modo oscuro/claro
- Componentes optimizados para touch

### ✅ Gestión de Estado
- Pinia stores configurados
- Manejo de errores global
- Estados de carga elegantes
- Persistencia de sesión

### ✅ Navegación y Seguridad
- Rutas protegidas por rol
- Middleware de autenticación
- Breadcrumbs dinámicos
- Guards de navegación

## 📁 Estructura del Proyecto

```
webapp/
├── src/
│   ├── api/                    # Clientes API
│   │   └── auth.ts            # API de autenticación
│   ├── assets/                # Recursos estáticos
│   │   └── styles/
│   │       └── main.css       # Estilos Tailwind + personalizados
│   ├── components/            # Componentes reutilizables
│   │   └── layout/            # Layouts principales
│   │       ├── AuthLayout.vue      # Layout para autenticación
│   │       └── DashboardLayout.vue # Layout principal
│   ├── router/                # Configuración de rutas
│   │   └── index.ts           # Router con guards
│   ├── stores/                # Pinia stores
│   │   └── auth.ts            # Store de autenticación
│   ├── types/                 # Definiciones TypeScript
│   │   └── index.ts           # Tipos principales
│   ├── views/                 # Vistas/páginas
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── reservations/      # Gestión de reservas
│   │   └── admin/             # Panel administrativo
│   ├── App.vue                # Componente raíz
│   └── main.ts                # Punto de entrada
├── index.html                 # HTML principal
├── package.json               # Dependencias
├── tailwind.config.js         # Configuración Tailwind
├── vite.config.ts             # Configuración Vite
└── tsconfig.json              # Configuración TypeScript
```

## 🎨 Integración con Figma

### Servidor MCP de Figma
El proyecto está configurado para integrarse con diseños de Figma:

- **URL del servidor**: `http://127.0.0.1:3845/mcp`
- **Referencias**: Cada componente incluye comentarios con referencias a nodos de Figma
- **Sincronización**: Los estilos pueden actualizarse basándose en cambios del diseño

### Estructura de Referencias
```vue
<!-- === FIGMA MCP REFERENCE === -->
<!-- Componente basado en los diseños de Figma -->
<!-- Servidor MCP: http://127.0.0.1:3845/mcp -->
```

## 🔧 Configuración

### Proxy API
El frontend se conecta al backend Laravel:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Tailwind + Flowbite
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: 'class',
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
  ],
}
```

## 🔐 Autenticación

### Gestión de Tokens
- Tokens JWT en localStorage
- Interceptors de Axios automáticos
- Limpieza al cerrar sesión
- Renovación automática

### Rutas Protegidas
```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole)) {
    next('/dashboard')
  } else {
    next()
  }
})
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px+ (Móvil grande)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Desktop)
- **xl**: 1280px+ (Desktop grande)

### Componentes Adaptativos
- Sidebar colapsable
- Grid responsive
- Navegación táctil
- Menús contextuales

## 🛠️ Desarrollo

### Setup Recomendado
- **IDE**: VS Code + Vue (Official)
- **DevTools**: Vue.js devtools
- **Node**: 18+ 
- **npm**: 8+

### Scripts Disponibles
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run dev -- --port 4321  # Puerto personalizado

# Producción
npm run build            # Build optimizado
npm run preview          # Preview del build

# Calidad
npm run lint             # ESLint
npm run type-check       # Verificación TypeScript
npm run test:unit        # Tests unitarios
```

## 🚀 Próximos Pasos

### Fase Actual - Estructura Base ✓
- [x] Configuración del proyecto
- [x] Layouts principales
- [x] Sistema de autenticación
- [x] Rutas protegidas
- [x] Integración con backend API

### Fase Siguiente - Funcionalidades Core
- [ ] Calendario interactivo de reservas
- [ ] Formularios dinámicos de reserva
- [ ] Panel administrativo completo
- [ ] Sistema de notificaciones
- [ ] Reportes y analíticas

### Fase Futura - Optimizaciones
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Optimización de performance

## 📚 Referencias

- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Flowbite](https://flowbite.com/)
- [Pinia](https://pinia.vuejs.org/)

---

**Desarrollado con ❤️ usando Vue 3 + TypeScript + Tailwind CSS**

*Para más información sobre el backend Laravel, consulta `/api/README.md`*
