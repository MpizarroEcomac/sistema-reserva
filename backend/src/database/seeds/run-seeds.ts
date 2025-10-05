import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Site } from '../entities/site.entity';
import { ResourceType } from '../entities/resource-type.entity';
import { Resource } from '../entities/resource.entity';
import { RuleSet } from '../entities/rule-set.entity';
import { User } from '../entities/user.entity';
import { Booking } from '../entities/booking.entity';
import { seedData } from './seed-data';

// Cargar variables de entorno
config();

async function runSeeds() {
  console.log('🌱 Iniciando seeds...');

  // Crear conexión a la base de datos
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE_PATH || 'database.sqlite',
    entities: [Site, ResourceType, Resource, RuleSet, User, Booking],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  console.log('✅ Conexión a base de datos establecida');

  try {
    // Ejecutar el seeding de datos
    await seedData(dataSource);
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

// Ejecutar seeds si es llamado directamente
if (require.main === module) {
  runSeeds();
}
