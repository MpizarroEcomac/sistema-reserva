# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sistema de Reservas Multi-Sede is a corporate booking system for managing **meeting rooms and parking spaces** across multiple company locations. This is a full-stack application designed as an MVP for scalable multi-location resource management.

### Technology Stack
- **Frontend**: Next.js 14 (React, App Router, Tailwind CSS)
- **Backend**: Node.js with NestJS framework
- **Database**: PostgreSQL with anti-overlap validation support
- **Infrastructure**: Docker + Docker Compose
- **Auth**: JWT + planned SSO integration (Google/Microsoft)

### Key Locations
- **Initial sites**: Santiago (SCL) and La Serena (LSC)
- **Designed for scalability**: Add new sites without code changes

## Common Development Commands

### Initial Setup
```bash
# Copy environment file and configure variables
cp .env.example .env

# Install dependencies for both backend and frontend
cd backend && npm install
cd ../frontend && npm install

# Alternative: Use Warp automation
warp setup
```

### Development Environment
```bash
# Start all services (PostgreSQL, Redis, Backend API, Frontend)
docker-compose up --build

# Alternative: Use Warp automation
warp dev:up

# Stop all services
warp dev:down
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Database Management
```bash
# Run database migrations
cd backend && npx typeorm migration:run

# Generate new migration
cd backend && npx typeorm migration:generate -n MigrationName

# Load initial data (Santiago/La Serena sites, base rules)
cd backend && npm run seed

# Alternative: Use Warp automation
warp db:migrate
warp db:seed
warp db:reset  # Complete database reset
```

### Testing and Quality
```bash
# Run linting for both projects
cd backend && npm run lint
cd ../frontend && npm run lint

# Run tests
cd backend && npm test
cd backend && npm run test:e2e

# Use Warp automation for both
warp lint
warp test
```

### Production Build
```bash
# Build both applications
cd backend && npm run build
cd ../frontend && npm run build

# Alternative: Use Warp automation
warp build

# Production deployment
warp prod:up
```

## Architecture & Data Model

### Core Entities
- **Site**: Physical locations (SCL, LSC, etc.)
- **ResourceType**: Types of bookable resources (sala, parking, locker, etc.)
- **Resource**: Specific resources (SCL-S1, LSC-P01, etc.)
- **RuleSet**: Configurable rules per site/resource type
- **Booking**: Time-based reservations with anti-overlap validation
- **User**: System users with role-based permissions

### User Roles
- **Usuario**: Create, edit, and cancel own bookings
- **Recepción**: Can create bookings on behalf of others
- **Admin de sede**: Manage resources and rules for their location
- **Admin global**: Manage all sites and global settings

### Key Business Rules
- **Booking validation**: Anti-overlap logic with PostgreSQL range types
- **Configurable constraints**: Min/max duration, advance booking limits, daily limits
- **Site-specific rules**: Different operating hours and policies per location
- **Buffer times**: Configurable cleanup/setup time between bookings

### Planned Directory Structure
```
backend/
├── src/
│   ├── modules/          # Feature modules (sites, resources, bookings, users)
│   ├── common/           # Shared utilities, guards, middlewares
│   ├── database/         # Migrations, seeds, database configuration
│   └── main.ts          # Application entry point
├── scripts/             # Automation scripts (site management, bulk imports)
└── test/               # E2E and integration tests

frontend/
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

## Site Management (Scalability)

### Adding New Sites
```bash
# Add a new site with base configuration
warp site:add --SITE_ID=ANF --SITE_NAME="Antofagasta" --TZ=America/Santiago

# Bulk import resources from CSV
warp resources:bulk --CSV_PATH=resources_anf.csv

# Set site-specific rules
warp rules:set --SITE_ID=ANF --RULES_JSON=rules_anf.json
```

### CSV Templates
Use `warp templates csv:resources` to generate resource import templates with the format:
- `site_id,resource_id,resource_type,nombre,capacidad,activo`

### Rule Configuration
Sites support JSON-based rule configuration for:
- **Operating hours**: Different schedules per site
- **Booking constraints**: Min/max duration, buffer times
- **User limits**: Daily booking limits, advance booking restrictions
- **Resource-specific rules**: Different policies for rooms vs parking

## Development Workflow

### Branch Protection
This project follows conventional commit messages as per the user's rules:
- **feat**: New functionality
- **fix**: Bug corrections  
- **docs**: Documentation updates
- **style**: Formatting changes
- **refactor**: Code changes without functionality impact
- **test**: Test additions/modifications
- **chore**: Maintenance tasks

### API Endpoints Structure
```
GET    /sites                    # List all sites and resources
GET    /sites/{id}/availability  # Check availability by date
POST   /bookings                # Create new booking
GET    /bookings/mias           # User's bookings
PATCH  /bookings/{id}           # Edit existing booking
DELETE /bookings/{id}           # Cancel booking
POST   /sites                   # Create site (admin)
POST   /resources:bulk          # Bulk import resources (admin)
POST   /rules                   # Define site rules (admin)
```

## Environment Variables

Key environment variables required for development:
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Authentication secret
- **NEXT_PUBLIC_API_URL**: Frontend to backend connection
- **SMTP_***: Email notification configuration
- **GOOGLE_CLIENT_***: SSO integration (optional)
- **MICROSOFT_CLIENT_***: SSO integration (optional)

## Monitoring and Debugging

```bash
# View all service logs
warp logs

# Create database backup
warp db:backup

# Check service status
docker-compose ps
```

## Domain-Specific Context

This system is specifically designed for **Chilean corporate environments** with:
- **Default timezone**: America/Santiago
- **Business hours**: Typically 08:00-20:00
- **Multi-site scenarios**: Companies with offices in multiple cities
- **Resource types**: Meeting rooms and parking spaces as primary use cases
- **Spanish UI/Messages**: User interface will be in Spanish

The architecture prioritizes **horizontal scalability** - new sites can be added through configuration rather than code changes, making it suitable for companies planning geographic expansion.