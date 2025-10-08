import { DataSource } from 'typeorm';
import { Site } from '../entities/site.entity';
import { ResourceType } from '../entities/resource-type.entity';
import { Resource } from '../entities/resource.entity';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { RuleSet } from '../entities/rule-set.entity';

export async function seedData(dataSource: DataSource) {
  console.log('🌱 Iniciando seeding de datos...');

  // Repository instances
  const siteRepo = dataSource.getRepository(Site);
  const resourceTypeRepo = dataSource.getRepository(ResourceType);
  const resourceRepo = dataSource.getRepository(Resource);
  const userRepo = dataSource.getRepository(User);
  const ruleSetRepo = dataSource.getRepository(RuleSet);

  // 1. Crear tipos de recursos
  console.log('📝 Creando tipos de recursos...');
  const resourceTypes = [
    {
      code: 'sala',
      name: 'Sala de reuniones',
      description: 'Espacios para reuniones corporativas con capacidad variable',
      icon: '🏢',
      color: '#3B82F6',
      config: {
        requiresLicensePlate: false,
        maxCapacity: 50,
        hasProjector: true
      }
    },
    {
      code: 'parking',
      name: 'Estacionamiento',
      description: 'Espacios de estacionamiento para vehículos',
      icon: '🚗',
      color: '#10B981',
      config: {
        requiresLicensePlate: true,
        maxCapacity: 1,
        hasProjector: false
      }
    }
  ];

  for (const rtData of resourceTypes) {
    const existing = await resourceTypeRepo.findOne({ where: { code: rtData.code } });
    if (!existing) {
      await resourceTypeRepo.save(resourceTypeRepo.create(rtData));
      console.log(`  ✅ Tipo de recurso creado: ${rtData.name}`);
    }
  }

  // 2. Crear sedes
  console.log('🏢 Creando sedes...');
  const sites = [
    {
      id: 'SCL',
      name: 'Santiago Centro',
      timezone: 'America/Santiago',
      address: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
      config: {
        phoneNumber: '+56912345678',
        contactEmail: 'scl@empresa.com'
      }
    },
    {
      id: 'LSC',
      name: 'Las Condes',
      timezone: 'America/Santiago',
      address: 'Av. Apoquindo 456, Las Condes, Santiago, Chile',
      config: {
        phoneNumber: '+56987654321',
        contactEmail: 'lsc@empresa.com'
      }
    }
  ];

  for (const siteData of sites) {
    const existing = await siteRepo.findOne({ where: { id: siteData.id } });
    if (!existing) {
      await siteRepo.save(siteRepo.create(siteData));
      console.log(`  ✅ Sede creada: ${siteData.name}`);
    }
  }

  // 3. Crear recursos
  console.log('🏠 Creando recursos...');
  const salaType = await resourceTypeRepo.findOne({ where: { code: 'sala' } });
  const parkingType = await resourceTypeRepo.findOne({ where: { code: 'parking' } });

  const resources = [
    // Santiago Centro - Salas
    {
      id: 'SCL-S1',
      name: 'Sala 1',
      description: 'Sala de reuniones con capacidad para 8 personas, incluye proyector',
      capacity: 8,
      location: 'Piso 2, Ala Norte',
      siteId: 'SCL',
      resourceTypeId: salaType?.id,
      config: {
        hasProjector: true,
        hasWhiteboard: true,
        hasVideoConference: true,
        equipment: ['projector', 'whiteboard', 'wifi', 'air-conditioning']
      }
    },
    {
      id: 'SCL-S2',
      name: 'Sala 2',
      description: 'Sala de reuniones con capacidad para 12 personas',
      capacity: 12,
      location: 'Piso 2, Ala Sur',
      siteId: 'SCL',
      resourceTypeId: salaType?.id,
      config: {
        hasProjector: true,
        hasWhiteboard: false,
        hasVideoConference: false,
        equipment: ['projector', 'wifi']
      }
    },
    // Santiago Centro - Estacionamientos
    {
      id: 'SCL-P1',
      name: 'Parking 1',
      description: 'Espacio de estacionamiento techado',
      capacity: 1,
      location: 'Subterráneo Nivel 1',
      siteId: 'SCL',
      resourceTypeId: parkingType?.id,
      config: {
        isAccessible: false,
        isCovered: true,
        level: 'B1'
      }
    },
    {
      id: 'SCL-P2',
      name: 'Parking 2',
      description: 'Espacio de estacionamiento para personas con discapacidad',
      capacity: 1,
      location: 'Subterráneo Nivel 1',
      siteId: 'SCL',
      resourceTypeId: parkingType?.id,
      config: {
        isAccessible: true,
        isCovered: true,
        level: 'B1'
      }
    },
    // Las Condes - Salas
    {
      id: 'LSC-S1',
      name: 'Sala Ejecutiva',
      description: 'Sala ejecutiva con capacidad para 6 personas, equipamiento premium',
      capacity: 6,
      location: 'Piso 10',
      siteId: 'LSC',
      resourceTypeId: salaType?.id,
      config: {
        hasProjector: true,
        hasWhiteboard: true,
        hasVideoConference: true,
        equipment: ['projector', 'whiteboard', 'wifi', 'air-conditioning', '4k-display']
      }
    },
    // Las Condes - Estacionamientos
    {
      id: 'LSC-P1',
      name: 'Parking VIP 1',
      description: 'Espacio de estacionamiento VIP',
      capacity: 1,
      location: 'Nivel Plaza',
      siteId: 'LSC',
      resourceTypeId: parkingType?.id,
      config: {
        isAccessible: true,
        isCovered: false,
        level: 'P1'
      }
    }
  ];

  for (const resourceData of resources) {
    const existing = await resourceRepo.findOne({ where: { id: resourceData.id } });
    if (!existing) {
      await resourceRepo.save(resourceRepo.create(resourceData));
      console.log(`  ✅ Recurso creado: ${resourceData.name}`);
    }
  }

  // 4. Crear usuarios
  console.log('👤 Creando usuarios...');
  const users = [
    {
      email: 'admin@empresa.com',
      password: 'admin123',
      fullName: 'Administrador Global',
      role: UserRole.GLOBAL_ADMIN,
      status: UserStatus.ACTIVE,
      department: 'TI',
      position: 'Administrador de Sistemas'
    },
    {
      email: 'scl.admin@empresa.com',
      password: 'admin123',
      fullName: 'Admin Santiago Centro',
      role: UserRole.SITE_ADMIN,
      status: UserStatus.ACTIVE,
      assignedSites: ['SCL'],
      department: 'Administración',
      position: 'Administrador de Sede'
    },
    {
      email: 'juan.perez@empresa.com',
      password: 'user123',
      fullName: 'Juan Pérez González',
      phone: '+56912345678',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      department: 'Desarrollo',
      position: 'Desarrollador Senior'
    },
    {
      email: 'maria.gonzalez@empresa.com',
      password: 'user123',
      fullName: 'María González López',
      phone: '+56987654321',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      department: 'Marketing',
      position: 'Gerente de Marketing'
    }
  ];

  for (const userData of users) {
    const existing = await userRepo.findOne({ where: { email: userData.email } });
    if (!existing) {
      await userRepo.save(userRepo.create(userData));
      console.log(`  ✅ Usuario creado: ${userData.fullName}`);
    }
  }

  // 5. Crear reglas por defecto
  console.log('📋 Creando reglas de negocio...');
  const rules = [
    {
      name: 'Reglas Salas SCL',
      description: 'Reglas para reserva de salas en Santiago Centro',
      siteId: 'SCL',
      resourceTypeId: salaType?.id,
      priority: 1,
      rules: {
        operatingHours: ['08:00-20:00'],
        minDuration: 30,
        maxDuration: 240,
        bufferTime: 10,
        maxBookingsPerDay: 3,
        maxAdvanceBookingDays: 30,
        allowedWeekdays: [1, 2, 3, 4, 5], // Lunes a viernes
        maxAttendees: 50,
        allowConcurrentBookings: false,
        allowModification: true,
        minCancellationMinutes: 60
      }
    },
    {
      name: 'Reglas Parking SCL',
      description: 'Reglas para reserva de estacionamiento en Santiago Centro',
      siteId: 'SCL',
      resourceTypeId: parkingType?.id,
      priority: 1,
      rules: {
        operatingHours: ['06:00-22:00'],
        minDuration: 60,
        maxDuration: 600, // 10 horas
        bufferTime: 0,
        maxBookingsPerDay: 1,
        maxAdvanceBookingDays: 7,
        allowedWeekdays: [1, 2, 3, 4, 5],
        requiresLicensePlate: true,
        allowConcurrentBookings: false,
        allowModification: true,
        minCancellationMinutes: 30
      }
    }
  ];

  for (const ruleData of rules) {
    const existing = await ruleSetRepo.findOne({ 
      where: { 
        siteId: ruleData.siteId, 
        resourceTypeId: ruleData.resourceTypeId 
      } 
    });
    if (!existing) {
      await ruleSetRepo.save(ruleSetRepo.create(ruleData));
      console.log(`  ✅ Reglas creadas: ${ruleData.name}`);
    }
  }

  console.log('✅ Seeding completado exitosamente!');
}