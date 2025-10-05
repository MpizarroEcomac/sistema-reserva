import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Site } from './site.entity';
import { ResourceType } from './resource-type.entity';
import { Booking } from './booking.entity';

@Entity('resources')
export class Resource {
  @ApiProperty({
    description: 'ID único del recurso',
    example: 'SCL-S1',
  })
  @PrimaryColumn({ length: 50 })
  id: string;

  @ApiProperty({
    description: 'Nombre display del recurso',
    example: 'Sala 1',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Descripción del recurso',
    example: 'Sala de reuniones con capacidad para 8 personas, incluye proyector',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Capacidad máxima del recurso',
    example: 8,
    required: false,
  })
  @Column({ type: 'integer', nullable: true })
  capacity?: number;

  @ApiProperty({
    description: 'Ubicación física dentro de la sede',
    example: 'Piso 2, Ala Norte',
    required: false,
  })
  @Column({ length: 200, nullable: true })
  location?: string;

  @ApiProperty({
    description: 'Indica si el recurso está activo',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Configuración específica del recurso',
    example: { 
      hasProjector: true, 
      hasWhiteboard: true, 
      hasVideoConference: false,
      equipment: ['projector', 'whiteboard', 'wifi']
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Foreign Keys
  @ApiProperty({
    description: 'ID de la sede a la que pertenece',
    example: 'SCL',
  })
  @Column({ name: 'site_id', length: 10 })
  siteId: string;

  @ApiProperty({
    description: 'ID del tipo de recurso',
    example: 1,
  })
  @Column({ name: 'resource_type_id' })
  resourceTypeId: number;

  // Relaciones
  @ManyToOne(() => Site, (site) => site.resources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => ResourceType, (resourceType) => resourceType.resources, {
    eager: true,
  })
  @JoinColumn({ name: 'resource_type_id' })
  resourceType: ResourceType;

  @OneToMany(() => Booking, (booking) => booking.resource)
  bookings: Booking[];
}