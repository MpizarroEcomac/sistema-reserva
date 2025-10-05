import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { RuleSet } from './rule-set.entity';

@Entity('resource_types')
export class ResourceType {
  @ApiProperty({
    description: 'ID único del tipo de recurso',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Código del tipo de recurso',
    example: 'sala',
  })
  @Column({ length: 50, unique: true })
  code: string;

  @ApiProperty({
    description: 'Nombre display del tipo de recurso',
    example: 'Sala de reuniones',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Descripción del tipo de recurso',
    example: 'Espacios para reuniones corporativas con capacidad variable',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Icono o emoji representativo',
    example: '🏢',
    required: false,
  })
  @Column({ length: 10, nullable: true })
  icon?: string;

  @ApiProperty({
    description: 'Color hex para UI',
    example: '#3B82F6',
    required: false,
  })
  @Column({ length: 7, nullable: true })
  color?: string;

  @ApiProperty({
    description: 'Indica si el tipo está activo',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Configuración específica del tipo',
    example: { requiresPatente: false, maxCapacity: 50 },
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

  // Relaciones
  @OneToMany(() => Resource, (resource) => resource.resourceType)
  resources: Resource[];

  @OneToMany(() => RuleSet, (ruleSet) => ruleSet.resourceType)
  ruleSets: RuleSet[];
}