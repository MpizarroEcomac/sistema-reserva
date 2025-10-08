import { Controller, Get, Param, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { ResourcesService, ResourceAvailabilityQuery } from './resources.service';
import { Resource } from '../../database/entities/resource.entity';
import { ResourceType } from '../../database/entities/resource-type.entity';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar todos los recursos',
    description: 'Obtiene todos los recursos del sistema con sus tipos y sedes.' 
  })
  @ApiQuery({
    name: 'siteId',
    required: false,
    description: 'Filtrar por sede',
    example: 'SCL',
  })
  @ApiQuery({
    name: 'resourceTypeId',
    required: false,
    description: 'Filtrar por tipo de recurso',
    example: 1,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de recursos obtenida exitosamente', 
    type: [Resource] 
  })
  findAll(@Query() query: ResourceAvailabilityQuery): Promise<Resource[]> {
    return this.resourcesService.findAll(query);
  }

  @Get('types')
  @ApiOperation({ 
    summary: 'Listar tipos de recursos',
    description: 'Obtiene todos los tipos de recursos disponibles.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tipos de recursos obtenida exitosamente', 
    type: [ResourceType] 
  })
  getResourceTypes(): Promise<ResourceType[]> {
    return this.resourcesService.getResourceTypes();
  }

  @Get('by-type/:typeCode')
  @ApiOperation({ 
    summary: 'Listar recursos por tipo',
    description: 'Obtiene todos los recursos de un tipo específico.' 
  })
  @ApiParam({
    name: 'typeCode',
    description: 'Código del tipo de recurso',
    example: 'sala',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de recursos por tipo obtenida exitosamente', 
    type: [Resource] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de recurso no encontrado' 
  })
  findByType(@Param('typeCode') typeCode: string): Promise<Resource[]> {
    return this.resourcesService.findByType(typeCode);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un recurso por ID',
    description: 'Obtiene los detalles de un recurso específico.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del recurso',
    example: 'SCL-S1',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Recurso encontrado', 
    type: Resource 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Recurso no encontrado' 
  })
  findOne(@Param('id') id: string): Promise<Resource> {
    return this.resourcesService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ 
    summary: 'Obtener disponibilidad de un recurso',
    description: 'Obtiene la disponibilidad de un recurso para una fecha específica.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del recurso',
    example: 'SCL-S1',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2025-10-05',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Disponibilidad obtenida exitosamente',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Recurso no encontrado' 
  })
  findAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.resourcesService.findAvailability(id, date);
  }
}
