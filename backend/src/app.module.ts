import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Database entities
import { Site } from './database/entities/site.entity';
import { ResourceType } from './database/entities/resource-type.entity';
import { Resource } from './database/entities/resource.entity';
import { RuleSet } from './database/entities/rule-set.entity';
import { Booking } from './database/entities/booking.entity';
import { User } from './database/entities/user.entity';

// Feature modules
import { SitesModule } from './modules/sites/sites.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_PATH') || 'database.sqlite',
        entities: [Site, ResourceType, Resource, RuleSet, Booking, User],
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: false,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Global JWT configuration
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    SitesModule,
    ResourcesModule,
    BookingsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}