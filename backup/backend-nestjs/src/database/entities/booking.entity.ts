import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { User } from './user.entity';

export enum BookingStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('bookings')
export class Booking {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la reserva',
    example: '2025-10-05T10:00:00Z',
  })
  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @ApiProperty({
    description: 'Fecha y hora de fin de la reserva',
    example: '2025-10-05T11:00:00Z',
  })
  @Column({ name: 'end_time', type: 'datetime' })
  endTime: Date;

  @ApiProperty({
    description: 'Rango temporal como texto para validación',
    example: '[2025-10-05 10:00:00,2025-10-05 11:00:00)',
  })
  @Column({ name: 'time_range', type: 'text' })
  timeRange: string;

  @ApiProperty({
    description: 'Propósito o motivo de la reserva',
    example: 'Reunión de equipo de desarrollo',
  })
  @Column({ length: 500 })
  purpose: string;

  @ApiProperty({
    description: 'Número de asistentes esperados',
    example: 5,
    required: false,
  })
  @Column({ name: 'attendee_count', type: 'integer', nullable: true })
  attendeeCount?: number;

  @ApiProperty({
    description: 'Lista de asistentes (emails)',
    example: ['juan@empresa.com', 'maria@empresa.com'],
    required: false,
  })
  @Column({ type: 'simple-array', nullable: true })
  attendees?: string[];

  @ApiProperty({
    description: 'Patente del vehículo (para estacionamientos)',
    example: 'ABCD12',
    required: false,
  })
  @Column({ name: 'license_plate', length: 10, nullable: true })
  licensePlate?: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    enum: BookingStatus,
    example: BookingStatus.ACTIVE,
  })
  @Column({
    type: 'text',
    default: BookingStatus.ACTIVE,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Notas adicionales de la reserva',
    example: 'Requiere acceso temprano al edificio',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Configuración específica de la reserva',
    example: { 
      requiresSetup: true,
      equipmentNeeded: ['projector'],
      cateringRequested: false
    },
    required: false,
  })
  @Column({ 
    type: 'text', 
    nullable: true,
    transformer: {
      to: (value: Record<string, any>) => value ? JSON.stringify(value) : null,
      from: (value: string) => value ? JSON.parse(value) : null
    }
  })
  config?: Record<string, any>;

  @ApiProperty({
    description: 'Fecha de cancelación',
    required: false,
  })
  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelledAt?: Date;

  @ApiProperty({
    description: 'Motivo de cancelación',
    example: 'Reunión reprogramada',
    required: false,
  })
  @Column({ name: 'cancellation_reason', length: 500, nullable: true })
  cancellationReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Foreign Keys
  @ApiProperty({
    description: 'ID del recurso reservado',
    example: 'SCL-S1',
  })
  @Column({ name: 'resource_id', length: 50 })
  resourceId: string;

  @ApiProperty({
    description: 'ID del usuario que hizo la reserva',
    example: 1,
  })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({
    description: 'ID del usuario que creó la reserva (puede ser diferente al usuario final)',
    example: 2,
  })
  @Column({ name: 'created_by_id' })
  createdById: number;

  // Relaciones
  @ManyToOne(() => Resource, (resource) => resource.bookings, {
    eager: true,
  })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @ManyToOne(() => User, (user) => user.bookings, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.createdBookings)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  // Métodos de utilidad
  @BeforeInsert()
  @BeforeUpdate()
  generateTimeRange() {
    if (this.startTime && this.endTime) {
      // Formato PostgreSQL tsrange: '[start_time,end_time)'
      const start = this.startTime.toISOString();
      const end = this.endTime.toISOString();
      this.timeRange = `[${start},${end})`;
    }
  }

  get duration(): number {
    if (this.startTime && this.endTime) {
      return Math.ceil((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)); // minutos
    }
    return 0;
  }

  get isActive(): boolean {
    return this.status === BookingStatus.ACTIVE;
  }

  get isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  get isUpcoming(): boolean {
    return this.isActive && this.startTime > new Date();
  }

  get isOngoing(): boolean {
    const now = new Date();
    return this.isActive && this.startTime <= now && this.endTime > now;
  }

  get isPast(): boolean {
    return this.endTime < new Date();
  }

  canEdit(): boolean {
    return this.isActive && this.isUpcoming;
  }

  canCancel(): boolean {
    return this.isActive && this.isUpcoming;
  }

  cancel(reason?: string): void {
    this.status = BookingStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
  }

  complete(): void {
    if (this.isPast) {
      this.status = BookingStatus.COMPLETED;
    }
  }

  markNoShow(): void {
    if (this.isPast) {
      this.status = BookingStatus.NO_SHOW;
    }
  }
}