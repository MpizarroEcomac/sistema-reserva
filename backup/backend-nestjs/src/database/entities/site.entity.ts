import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { RuleSet } from './rule-set.entity';

@Entity('sites')
export class Site {
  @ApiProperty({
    description: 'Código único de la sede',
    example: 'SCL',
  })
  @PrimaryColumn({ length: 10 })
  id: string;

  @ApiProperty({
    description: 'Nombre completo de la sede',
    example: 'Santiago Centro',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Zona horaria IANA de la sede',
    example: 'America/Santiago',
  })
  @Column({ name: 'timezone', default: 'America/Santiago' })
  timezone: string;

  @ApiProperty({
    description: 'Dirección física de la sede',
    example: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({
    description: 'Indica si la sede está activa',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Configuración adicional en formato JSON',
    example: { phoneNumber: '+56912345678', contactEmail: 'scl@empresa.com' },
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
  @OneToMany(() => Resource, (resource) => resource.site)
  resources: Resource[];

  @OneToMany(() => RuleSet, (ruleSet) => ruleSet.site)
  ruleSets: RuleSet[];
}