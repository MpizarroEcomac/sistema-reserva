import { IsString, IsOptional, IsBoolean, IsObject, Length, IsTimeZone } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty({
    description: 'Código único de la sede (mayúsculas)',
    example: 'SCL',
    minLength: 2,
    maxLength: 10,
  })
  @IsString()
  @Length(2, 10)
  id: string;

  @ApiProperty({
    description: 'Nombre completo de la sede',
    example: 'Santiago Centro',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Zona horaria IANA de la sede',
    example: 'America/Santiago',
    default: 'America/Santiago',
  })
  @IsOptional()
  @IsTimeZone()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Dirección física de la sede',
    example: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Indica si la sede está activa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Configuración adicional en formato JSON',
    example: { 
      phoneNumber: '+56912345678', 
      contactEmail: 'scl@empresa.com',
      parkingSpaces: 20,
      meetingRooms: 8
    },
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}