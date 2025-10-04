# 📖 Sistema de Reservas Multi-Sede

Sistema corporativo de reservas para gestionar **salas de reuniones y estacionamientos** en distintas sedes de la empresa.

## 📌 Descripción

Este proyecto es un **MVP sólido** para reservar salas y estacionamientos por franja horaria en múltiples oficinas:
- **Sedes iniciales**: Santiago y La Serena (parametrizable para futuras sucursales)
- **Recursos gestionados**: salas, estacionamientos, y posibilidad de agregar nuevos tipos (ej. lockers, bicicleteros)
- **Escalable**: diseñado para agregar nuevas sedes sin tocar código

### Roles de usuario
- **Usuario**: crea, edita y cancela sus reservas
- **Recepción**: puede reservar en nombre de otros
- **Admin de sede**: gestiona recursos y reglas de su oficina  
- **Admin global**: gestiona todas las sedes

### Características principales
- ✅ Evitar choques de reservas y sobrecupos
- ✅ Web responsive (móvil primero)
- ✅ Admin puede editar recursos sin tocar código
- ✅ Reglas configurables por sede/tipo de recurso
- ✅ Notificaciones por email/WhatsApp
- ✅ Reportes básicos de uso y ocupación

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (React, App Router, Tailwind CSS)
- **Backend**: Node.js con NestJS
- **Base de datos**: PostgreSQL (con soporte para rangos y validaciones anti-solapamiento)
- **Infraestructura**: Docker + Docker Compose
- **Notificaciones**: Email (SendGrid/SMTP), WhatsApp opcional
- **Autenticación**: Email + SSO corporativo (Google/Microsoft)

## 📂 Estructura del Proyecto

```
sistema-reserva/
├── backend/                # API NestJS
│   ├── src/
│   │   ├── modules/        # módulos (sites, resources, bookings, users)
│   │   ├── common/         # middlewares, guards, utils
│   │   └── main.ts         # entrypoint
│   ├── scripts/            # scripts para Warp (agregar sedes, importar recursos)
│   └── package.json
│
├── frontend/               # Cliente Next.js
│   ├── app/                # App Router
│   ├── components/         # UI reutilizable
│   └── package.json
│
├── docs/                   # Documentación adicional
├── database/               # Scripts y seeds de DB
├── tests/                  # Tests E2E
├── docker-compose.yml      # orquestación desarrollo
├── docker-compose.prod.yml # orquestación producción
├── warp.json              # tareas automatizadas
└── .env.example           # variables de entorno
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- Docker y Docker Compose
- PostgreSQL (si no usas Docker)

### Configuración inicial

1. **Clonar y configurar:**
```bash
git clone <repo>
cd sistema-reserva
cp .env.example .env
# Completar variables en .env
```

2. **Instalar dependencias:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. **Levantar con Docker:**
```bash
docker-compose up --build
```

Esto levanta:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000  
- **PostgreSQL**: localhost:5432

## ⚙️ Variables de Entorno

Ejemplo de `.env`:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/reservas

# Backend
PORT=4000
JWT_SECRET=supersecretkey
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Notificaciones
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@empresa.com
SMTP_PASS=tu_password

# Opcional: SSO
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_secret
```

## 📊 Modelo de Datos

### Entidades principales
- **Site**: sedes (SCL, LSC, ANF, etc.)
- **ResourceType**: tipos de recursos (sala, parking, locker, etc.)  
- **Resource**: recursos específicos (SCL-S1, LSC-P01, etc.)
- **RuleSet**: reglas configurables por sede/tipo
- **Booking**: reservas con validación anti-solapamiento
- **User**: usuarios con roles

### Datos iniciales
```json
{
  "sedes": [
    {
      "id": "SCL", 
      "nombre": "Santiago",
      "recursos": {
        "salas": ["SCL-S1", "SCL-S2", "SCL-S3", "SCL-S4"],
        "estacionamientos": ["SCL-P01", "SCL-P02", "...", "SCL-P10"]
      }
    },
    {
      "id": "LSC",
      "nombre": "La Serena", 
      "recursos": {
        "salas": ["LSC-S1", "LSC-S2", "LSC-S3", "LSC-S4"],
        "estacionamientos": ["LSC-P01", "...", "LSC-P10"]
      }
    }
  ]
}
```

## 🎯 Funcionalidades del MVP

### Flujo de usuario
1. **Elegir sede** → Santiago o La Serena
2. **Elegir recurso** → Salas o Estacionamientos  
3. **Ver disponibilidad** → Vista agenda + "próximo slot libre"
4. **Reservar** → Rango horario, propósito, asistentes, patente (parking)
5. **Confirmación** → Email/WhatsApp
6. **Gestionar** → Ver/editar/cancelar mis reservas

### Reglas configurables
- Horario operativo por sede (08:00–20:00)
- Duración mínima/máxima (30–180 min salas; 30–600 min parking)
- Buffer entre reservas (10 min salas; 0 min parking)
- Límite de reservas por usuario/día (2 activas)
- Anticipo máximo (30 días)
- Validación anti-solapamiento

### Panel Admin
- CRUD de sedes, recursos, reglas
- Importación masiva CSV
- Clonación de sedes como plantilla
- Reportes básicos (uso, ocupación, top usuarios)

## 📋 API Endpoints

```
GET    /sites                    # Lista sedes y recursos
GET    /sites/{id}/availability  # Disponibilidad por día
POST   /bookings                # Crear reserva
GET    /bookings/mias           # Mis reservas  
PATCH  /bookings/{id}           # Editar reserva
DELETE /bookings/{id}           # Cancelar reserva
POST   /sites                   # Crear sede (admin)
POST   /resources:bulk          # Importar recursos CSV (admin)
POST   /rules                   # Definir reglas (admin)
```

## 🧩 Roadmap

### Fase 1 - MVP (Completado)
- ✅ Setup del proyecto
- ✅ Estructura base backend/frontend  
- ✅ Configuración Docker
- ✅ Documentación inicial

### Fase 2 - Core Backend (En progreso)
- [ ] Modelos y entidades TypeORM
- [ ] API REST endpoints
- [ ] Validaciones anti-solapamiento
- [ ] Autenticación JWT
- [ ] Seeds iniciales (SCL/LSC)

### Fase 3 - Core Frontend  
- [ ] UI components (Tailwind)
- [ ] Selector de sede + recursos
- [ ] Calendario de disponibilidad
- [ ] Formularios de reserva
- [ ] Mis reservas

### Fase 4 - Panel Admin
- [ ] CRUD sedes y recursos
- [ ] Importación CSV
- [ ] Configuración de reglas
- [ ] Reportes básicos

### Fase 5 - Piloto & Expansión
- [ ] Deploy en servidor
- [ ] Piloto en Santiago
- [ ] Activar La Serena  
- [ ] Documentar escalabilidad

## 🤝 Plantillas para Escalabilidad

### CSV Recursos
```csv
site_id,resource_id,resource_type,nombre,capacidad,activo
SCL,SCL-S1,sala,Sala 1,,true
SCL,SCL-S2,sala,Sala 2,,true
SCL,SCL-P01,parking,Parking 01,,true
LSC,LSC-S1,sala,Sala 1,,true  
LSC,LSC-P01,parking,Parking 01,,true
```

### JSON Reglas
```json
{
  "sala": {
    "horario": ["08:00-20:00"],
    "min": 30,
    "max": 180, 
    "buffer": 10,
    "limite_dia": 2,
    "anticipacion_dias": 30
  },
  "parking": {
    "horario": ["08:00-20:00"],
    "min": 30,
    "max": 600,
    "buffer": 0, 
    "limite_dia": 2,
    "anticipacion_dias": 30
  }
}
```

## 📄 Comandos Útiles

```bash
# Desarrollo
npm run start:dev          # Backend modo desarrollo
npm run dev                # Frontend modo desarrollo  
docker-compose up          # Levantar todo

# Base de datos
npm run migration:generate # Generar migración
npm run migration:run      # Aplicar migraciones
npm run seed              # Cargar datos iniciales

# Producción  
npm run build             # Build backend + frontend
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Consideraciones de Seguridad

- Autenticación JWT + roles
- Validación de inputs (class-validator) 
- Rate limiting por usuario
- Audit log de reservas
- Variables sensibles en .env
- HTTPS en producción

## 📞 Soporte

Para preguntas sobre el proyecto:
- Documentación técnica: `/docs`
- Issues: crear issue en el repositorio
- Contacto: equipo de desarrollo

---

## 📝 Licencia

Proyecto privado - uso exclusivo de la empresa.

**¡Listo para escalar a nuevas sedes! 🚀**