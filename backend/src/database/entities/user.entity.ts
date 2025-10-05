import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Booking } from './booking.entity';

export enum UserRole {
  USER = 'user',
  RECEPTION = 'reception',
  SITE_ADMIN = 'site_admin',
  GLOBAL_ADMIN = 'global_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@empresa.com',
  })
  @Column({ length: 200, unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña hasheada',
    writeOnly: true,
  })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
  })
  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+56912345678',
    required: false,
  })
  @Column({ length: 20, nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column({
    type: 'text',
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @Column({
    type: 'text',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Sede(s) a las que el usuario tiene acceso (para site_admin)',
    example: ['SCL', 'LSC'],
    required: false,
  })
  @Column({ name: 'assigned_sites', type: 'simple-array', nullable: true })
  assignedSites?: string[];

  @ApiProperty({
    description: 'Departamento o área del usuario',
    example: 'Tecnología',
    required: false,
  })
  @Column({ length: 100, nullable: true })
  department?: string;

  @ApiProperty({
    description: 'Cargo del usuario',
    example: 'Desarrollador Senior',
    required: false,
  })
  @Column({ length: 100, nullable: true })
  position?: string;

  @ApiProperty({
    description: 'Configuración específica del usuario',
    example: { 
      notifications: { email: true, sms: false },
      defaultSite: 'SCL',
      language: 'es'
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
    description: 'Fecha del último login',
    required: false,
  })
  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.createdBy)
  createdBookings: Booking[];

  // Métodos
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Métodos de utilidad para roles
  get isAdmin(): boolean {
    return this.role === UserRole.GLOBAL_ADMIN;
  }

  get isSiteAdmin(): boolean {
    return this.role === UserRole.SITE_ADMIN || this.isAdmin;
  }

  get isReception(): boolean {
    return this.role === UserRole.RECEPTION || this.isSiteAdmin;
  }

  canAccessSite(siteId: string): boolean {
    if (this.isAdmin) return true;
    if (this.role === UserRole.USER || this.role === UserRole.RECEPTION) return true;
    if (this.role === UserRole.SITE_ADMIN && this.assignedSites) {
      return this.assignedSites.includes(siteId);
    }
    return false;
  }

  canManageSite(siteId: string): boolean {
    if (this.isAdmin) return true;
    if (this.role === UserRole.SITE_ADMIN && this.assignedSites) {
      return this.assignedSites.includes(siteId);
    }
    return false;
  }
}