import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Site } from './site.entity';
import { ResourceType } from './resource-type.entity';

export interface BookingRules {
  // Horarios de operación
  operatingHours: string[]; // ['08:00-20:00'] o ['08:00-12:00', '14:00-18:00']
  
  // Restricciones de duración (en minutos)
  minDuration: number;
  maxDuration: number;
  
  // Buffer entre reservas (en minutos)
  bufferTime: number;
  
  // Límites de usuario
  maxBookingsPerDay: number;
  maxBookingsPerWeek?: number;
  
  // Restricciones de anticipación
  maxAdvanceBookingDays: number;
  minAdvanceBookingMinutes?: number;
  
  // Días de la semana permitidos (0=domingo, 1=lunes, etc.)
  allowedWeekdays?: number[];
  
  // Configuración específica por tipo de recurso
  requiresLicensePlate?: boolean; // para estacionamientos
  maxAttendees?: number; // para salas
  
  // Restricciones adicionales
  allowConcurrentBookings?: boolean; // si un usuario puede tener múltiples reservas activas
  requiresApproval?: boolean; // si requiere aprobación manual
  
  // Políticas de cancelación
  minCancellationMinutes?: number; // tiempo mínimo antes del inicio para cancelar
  allowModification?: boolean; // si permite modificar reservas existentes
}

@Entity('rule_sets')
@Unique(['siteId', 'resourceTypeId'])
export class RuleSet {
  @ApiProperty({
    description: 'ID único del conjunto de reglas',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre descriptivo del conjunto de reglas',
    example: 'Reglas salas SCL',
  })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({
    description: 'Descripción de las reglas',
    example: 'Reglas para reserva de salas en Santiago Centro',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Configuración de reglas en formato JSON',
    example: {
      operatingHours: ['08:00-20:00'],
      minDuration: 30,
      maxDuration: 180,
      bufferTime: 10,
      maxBookingsPerDay: 2,
      maxAdvanceBookingDays: 30,
      allowedWeekdays: [1, 2, 3, 4, 5], // Lunes a viernes
      maxAttendees: 50
    },
  })
  @Column({ 
    type: 'text',
    transformer: {
      to: (value: BookingRules) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value)
    }
  })
  rules: BookingRules;

  @ApiProperty({
    description: 'Indica si el conjunto de reglas está activo',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Prioridad del conjunto de reglas (mayor número = mayor prioridad)',
    example: 1,
  })
  @Column({ default: 1 })
  priority: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Foreign Keys
  @ApiProperty({
    description: 'ID de la sede (opcional, null = reglas globales)',
    example: 'SCL',
  })
  @Column({ name: 'site_id', length: 10, nullable: true })
  siteId?: string;

  @ApiProperty({
    description: 'ID del tipo de recurso (opcional, null = todos los tipos)',
    example: 1,
  })
  @Column({ name: 'resource_type_id', nullable: true })
  resourceTypeId?: number;

  // Relaciones
  @ManyToOne(() => Site, (site) => site.ruleSets, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'site_id' })
  site?: Site;

  @ManyToOne(() => ResourceType, (resourceType) => resourceType.ruleSets, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'resource_type_id' })
  resourceType?: ResourceType;

  // Métodos de utilidad
  isOperatingTime(dateTime: Date): boolean {
    const timeString = dateTime.toTimeString().substring(0, 5); // "HH:MM"
    
    return this.rules.operatingHours.some(range => {
      if (range.includes('-')) {
        const [start, end] = range.split('-');
        return timeString >= start && timeString <= end;
      }
      return false;
    });
  }

  isAllowedWeekday(dateTime: Date): boolean {
    if (!this.rules.allowedWeekdays) return true;
    const weekday = dateTime.getDay();
    return this.rules.allowedWeekdays.includes(weekday);
  }

  isValidDuration(durationMinutes: number): boolean {
    return durationMinutes >= this.rules.minDuration && 
           durationMinutes <= this.rules.maxDuration;
  }

  isWithinAdvanceLimit(bookingDateTime: Date, now: Date = new Date()): boolean {
    const diffHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffHours <= this.rules.maxAdvanceBookingDays;
  }

  isMinimumAdvance(bookingDateTime: Date, now: Date = new Date()): boolean {
    if (!this.rules.minAdvanceBookingMinutes) return true;
    
    const diffMinutes = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= this.rules.minAdvanceBookingMinutes;
  }

  canCancelAt(bookingStartTime: Date, now: Date = new Date()): boolean {
    if (!this.rules.minCancellationMinutes) return true;
    
    const diffMinutes = (bookingStartTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= this.rules.minCancellationMinutes;
  }

  // Método para crear reglas por defecto
  static createDefaultRules(resourceTypeCode: string): BookingRules {
    const baseRules: BookingRules = {
      operatingHours: ['08:00-20:00'],
      minDuration: 30,
      maxDuration: 180,
      bufferTime: 10,
      maxBookingsPerDay: 2,
      maxAdvanceBookingDays: 30,
      allowedWeekdays: [1, 2, 3, 4, 5], // Lunes a viernes
      allowConcurrentBookings: false,
      allowModification: true,
      minCancellationMinutes: 60,
    };

    switch (resourceTypeCode) {
      case 'parking':
        return {
          ...baseRules,
          maxDuration: 600, // 10 horas
          bufferTime: 0,
          requiresLicensePlate: true,
        };
      
      case 'sala':
        return {
          ...baseRules,
          maxAttendees: 50,
        };
      
      default:
        return baseRules;
    }
  }
}