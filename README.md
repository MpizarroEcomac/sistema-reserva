# 📖 Sistema de Reservas Multi-Sede (Laravel 12 + Vue 3)

Sistema corporativo de reservas para gestionar **salas de reuniones y estacionamientos** en distintas sedes de la empresa.

---

## 📌 Descripción

Este proyecto es un **MVP sólido** para reservar salas y estacionamientos por franja horaria en múltiples oficinas:

- **Sedes iniciales**: Santiago y La Serena (parametrizable para futuras sucursales)
- **Recursos gestionados**: salas, estacionamientos, y posibilidad de agregar nuevos tipos (p. ej., lockers, bicicleteros)
- **Escalable**: diseñado para agregar nuevas sedes **sin tocar código**

### Roles de usuario
- **Usuario**: crea, edita y cancela sus reservas  
- **Recepción**: puede reservar en nombre de otros  
- **Admin de sede**: gestiona recursos y reglas de su oficina  
- **Admin global**: gestiona todas las sedes

### Características principales
- ✅ Evitar choques de reservas y sobrecupos  
- ✅ Web responsive (móvil primero) con **Vue 3 + Vite**  
- ✅ Admin puede editar recursos sin tocar código  
- ✅ Reglas configurables por sede/tipo de recurso  
- ✅ Notificaciones por **Email (SendGrid/SMTP)** y **WhatsApp (opcional)**  
- ✅ Reportes básicos de uso y ocupación  
- ✅ **Autenticación corporativa** (Email/password + SSO Google/Microsoft)  
- ✅ **Autenticación Multi-Factor**: **TOTP** (Authenticator) y **WebAuthn/Biométrica**  

---

## 🛠️ Stack Tecnológico

- **Backend**: **Laravel 12** (PHP 8.2+)  
- **Frontend**: **Vue 3** + Vite (SPA o Inertia; este repo usa SPA separada)  
- **Base de datos**: **MySQL 8.0+**  
- **Auth API**: **Laravel Sanctum** (tokens y SPA)  
- **Colas**: **Laravel Queues** (database/Redis) para notificaciones y tareas async  
- **Notificaciones**: Email (SendGrid/SMTP), **WhatsApp opcional** (Twilio u otro)  
- **SSO**: Google / Microsoft OAuth 2.0  
- **MFA**: TOTP + **WebAuthn** (llave de seguridad/TouchID/Windows Hello)  
- **Infraestructura**: Docker + Docker Compose

### Requisitos del Sistema
- **PHP**: 8.2 o superior  
- **MySQL**: 8.0 o superior  
- **Composer**: 2.0+  
- **Node.js**: 18+ (build de assets)  
- **Docker** y **Docker Compose** (opcional para desarrollo/producción)
---

## 📂 Estructura del Proyecto

```
sistema-reserva/
├── api/                     # Laravel 12 (API + Panel Admin)
│   ├── app/
│   │   ├── Models/          # Site, ResourceType, Resource, RuleSet, Booking, User, MfaCredential
│   │   ├── Http/            # Controllers, Requests, Middleware (RBAC, Sanctum)
│   │   ├── Notifications/   # Emails, WhatsApp
│   │   └── Policies/        # Autorización por rol
│   ├── database/            # Migrations, Seeders, Factories
│   ├── routes/              # api.php, web.php
│   ├── config/              # sanctum, queue, mail, webauthn, services
│   └── composer.json
│
├── webapp/                  # Vue 3 (SPA)
│   ├── src/
│   │   ├── api/             # clientes axios
│   │   ├── components/      # UI reutilizable
│   │   ├── stores/          # Pinia
│   │   ├── views/           # pantallas
│   │   └── router/          # rutas protegidas
│   └── package.json
│
├── docker-compose.yml       # orquestación desarrollo
├── docker-compose.prod.yml  # orquestación producción
├── seeds/                   # Seeds JSON/CSV (recursos, reglas)
├── tests/                   # Tests Feature/Unit (PHPUnit) + E2E web (Playwright opcional)
└── .env.example
```

---

## 🚀 Instalación y Ejecución

### 1) Clonar y configurar
```bash
git clone <repo>
cd sistema-reserva
cp .env.example .env
```

### 2) Backend (Laravel)
```bash
cd api
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
# Opcional: iniciar colas
php artisan queue:work
```

### 3) Frontend (Vue)
```bash
cd ../webapp
npm install
npm run dev              # desarrollo (http://localhost:5173)
```

### 4) Docker (alternativa "todo en uno")
```bash
cd ..
docker-compose up --build
```

Esto levanta:
- **API Laravel**: http://localhost:8000  
- **SPA Vue**: http://localhost:5173 (o http://localhost si nginx proxy)  
- **MySQL**: localhost:3306

---

## ⚙️ Variables de Entorno

Ejemplo de `.env` (ajusta según tu entorno):

```env
# --- App ---
APP_NAME="Reservas MultiSede"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000
APP_TIMEZONE=America/Santiago

# --- DB ---
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservas
DB_USERNAME=root
DB_PASSWORD=secret

# --- Sanctum / SPA ---
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173

# --- Cola ---
QUEUE_CONNECTION=database
# Opcional Redis:
# REDIS_HOST=127.0.0.1
# REDIS_PASSWORD=null
# REDIS_PORT=6379
# QUEUE_CONNECTION=redis

# --- Mail (SendGrid/SMTP) ---
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=notificaciones@empresa.com
MAIL_FROM_NAME="${APP_NAME}"

# --- WhatsApp (opcional; Twilio) ---
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+1415xxxxxxx

# --- OAuth SSO ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=${APP_URL}/auth/callback/google

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_REDIRECT_URI=${APP_URL}/auth/callback/microsoft

# --- MFA (TOTP / WebAuthn) ---
MFA_TOTP_ENABLED=true
WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_NAME="${APP_NAME}"
WEBAUTHN_ORIGIN=http://localhost:8000
```

---

## 📊 Modelo de Datos

### Entidades principales
- **Site**: sedes (SCL, LSC, ANF, etc.)  
- **ResourceType**: tipos de recursos (sala, parking, locker, etc.)  
- **Resource**: recursos específicos (SCL-S1, LSC-P01, …) con atributos (capacidad, equipamiento, etiquetas)  
- **RuleSet**: reglas por sede/tipo (horario, min/max, buffer, límite por día, anticipación, etc.)  
- **Booking**: reservas con validación anti‑solapamiento  
- **User**: usuarios con roles (RBAC)  
- **MfaCredential**: seeds/credenciales para TOTP y registros **WebAuthn** (claves públicas)

### Datos iniciales (ejemplo)
```json
{
  "sedes": [
    {
      "id": "SCL",
      "nombre": "Santiago",
      "recursos": {
        "salas": ["SCL-S1","SCL-S2","SCL-S3","SCL-S4"],
        "estacionamientos": ["SCL-P01","SCL-P02","...","SCL-P10"]
      }
    },
    {
      "id": "LSC",
      "nombre": "La Serena",
      "recursos": {
        "salas": ["LSC-S1","LSC-S2","LSC-S3","LSC-S4"],
        "estacionamientos": ["LSC-P01","...","LSC-P10"]
      }
    }
  ]
}
```

> **Anti‑solapamiento (MySQL 8)**: se aplica con **índices** (`resource_id`, `start_at`, `end_at`) y validación transaccional en el **Service** (consulta de overlaps antes de crear/editar). Reglas de buffer se aplican a nivel de dominio.

---

## 🎯 Funcionalidades del MVP

### Flujo de usuario
1. **Elegir sede** → Santiago o La Serena  
2. **Elegir recurso** → Salas o Estacionamientos  
3. **Ver disponibilidad** → Vista agenda + "próximo slot libre"  
4. **Reservar** → Rango horario, propósito, asistentes, patente (parking)  
5. **Confirmación** → Email/WhatsApp  
6. **Gestionar** → Ver/editar/cancelar mis reservas  
7. **Check‑in** (fase 2): QR o botón; **auto‑liberación** por no show

### Reglas configurables
- Horario operativo por sede (08:00–20:00)  
- Duración mínima/máxima (salas: 30–180 min; parking: 30–600 min)  
- Buffer entre reservas (salas: 10 min; parking: 0 min)  
- Límite de reservas por usuario/día (2 activas)  
- Anticipo máximo (30 días)  
- Validación anti‑solapamiento

### Panel Admin
- CRUD de sedes, recursos, reglas (interfaz Vue protegida por rol)  
- Importación masiva **CSV**  
- Clonación de sedes como plantilla  
- Reportes básicos (uso, ocupación, top usuarios)

---

## 🔐 Autenticación, SSO y MFA

- **Sanctum** para SPA: CSRF + tokens first‑party  
- **Email/Password** + **SSO Google/Microsoft** (Laravel Socialite)  
- **MFA**:
  - **TOTP** (Google Authenticator, Authy, etc.) con backup codes  
  - **WebAuthn**: registro/validación de llaves de seguridad o biometría del dispositivo  
- **RBAC** por políticas: `User`, `Reception`, `SiteAdmin`, `SuperAdmin`  
- **Auditoría**: eventos de seguridad y reservas (creación, edición, cancelación, no‑show)

---

## 📬 Notificaciones

- **Email** con Mailables (SendGrid/SMTP)  
- **WhatsApp** (opcional) vía Twilio u otro gateway  
- Plantillas: **confirmación**, **recordatorio**, **cambio**, **cancelación**, **no‑show**, **auto‑liberación**  
- Envíos **asíncronos** con **colas** (recomendado Redis en producción)

---

## 📋 API Endpoints (resumen)

```http
# Auth
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/me

# SSO
GET    /auth/redirect/google
GET    /auth/callback/google
GET    /auth/redirect/microsoft
GET    /auth/callback/microsoft

# MFA
POST   /api/mfa/totp/setup
POST   /api/mfa/totp/verify
POST   /api/mfa/totp/disable
POST   /api/mfa/webauthn/register/options
POST   /api/mfa/webauthn/register/verify
POST   /api/mfa/webauthn/assert/options
POST   /api/mfa/webauthn/assert/verify

# Catálogo
GET    /api/sites
GET    /api/resources?site=SCL&type=sala|parking
GET    /api/sites/{id}/availability?date=YYYY-MM-DD&type=sala|parking

# Bookings
POST   /api/bookings
GET    /api/bookings/mine
PATCH  /api/bookings/{id}
DELETE /api/bookings/{id}

# Admin
POST   /api/sites
POST   /api/resources/bulk
POST   /api/rules
GET    /api/reports/usage?site=SCL&from=...&to=...
```

---

## 🧩 Plantillas para Escalabilidad

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

---

## 🧪 Comandos Útiles

```bash
# Backend (Laravel)
php artisan serve                    # API dev
php artisan migrate                  # Migraciones
php artisan db:seed                  # Seeds iniciales (SCL/LSC)
php artisan queue:work               # Trabajador de colas
php artisan test                     # Tests

# Frontend (Vue)
npm run dev                          # Dev
npm run build                        # Build producción
npm run preview                      # Previa de build

# Docker
docker-compose up --build
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 Consideraciones de Seguridad

- **Sanctum** + CSRF + cookies httpOnly  
- **SSO**: Google/Microsoft con scopes mínimos  
- **MFA**: TOTP + WebAuthn; **backup codes** y enforcement por rol  
- **Rate limiting** por IP/usuario en endpoints críticos  
- **Validación** de inputs (FormRequest)  
- **Auditoría** de acciones clave  
- **HTTPS** en producción; **HSTS** recomendado  
- **Variables sensibles** en `.env` (nunca versionar)  
- **CORS** restringido a dominios internos

---

## 🧭 Roadmap

### Fase 1 — MVP (Estructura)
- ✅ Setup Laravel + Vue  
- ✅ Configuración Docker  
- ✅ Seeds base SCL/LSC  
- ✅ Documentación inicial

### Fase 2 — Core Backend (En progreso)
- [ ] Modelos + Migrations (incl. MfaCredential)  
- [ ] Reglas anti‑solapamiento (+ buffer)  
- [ ] Endpoints REST y Policies (RBAC)  
- [ ] Notificaciones por colas (email / WhatsApp opcional)

### Fase 3 — Core Frontend
- [ ] Login/Registro + SSO + MFA  
- [ ] Selector de sede/recursos  
- [ ] Calendario de disponibilidad  
- [ ] Formularios de reserva  
- [ ] "Mis reservas"

### Fase 4 — Panel Admin
- [ ] CRUD sedes, recursos, reglas  
- [ ] Importación CSV  
- [ ] Reportes básicos

### Fase 5 — Piloto & Expansión
- [ ] Deploy  
- [ ] Piloto en Santiago  
- [ ] Activar La Serena  
- [ ] Documentar escalabilidad

---

## 📞 Soporte

- Documentación técnica: `/docs`  
- Issues: crear issue en el repositorio  
- Contacto: equipo de desarrollo

---

## 📝 Licencia

Proyecto privado – uso exclusivo de la empresa.

**¡Listo para escalar a nuevas sedes con Laravel + Vue! 🚀**
