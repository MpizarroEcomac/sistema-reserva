import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from '../../database/entities/site.entity';
// TODO: Implementar guards cuando esté listo el módulo de auth
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../../database/entities/user.entity';

@ApiTags('sites')
@Controller('sites')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear una nueva sede',
    description: 'Crea una nueva sede en el sistema. Requiere permisos de administrador.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Sede creada exitosamente', 
    type: Site 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Ya existe una sede con ese ID' 
  })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.GLOBAL_ADMIN)
  create(@Body() createSiteDto: CreateSiteDto): Promise<Site> {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas las sedes',
    description: 'Obtiene todas las sedes del sistema con sus recursos activos.' 
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Incluir sedes inactivas en la respuesta',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de sedes obtenida exitosamente', 
    type: [Site] 
  })
  findAll(@Query('includeInactive') includeInactive?: boolean): Promise<Site[]> {
    return this.sitesService.findAll(includeInactive);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una sede por ID',
    description: 'Obtiene los detalles de una sede específica incluyendo sus recursos y reglas.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sede encontrada', 
    type: Site 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sede no encontrada' 
  })
  findOne(@Param('id') id: string): Promise<Site> {
    return this.sitesService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ 
    summary: 'Obtener disponibilidad de una sede',
    description: 'Obtiene la disponibilidad de todos los recursos de una sede para una fecha específica.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2025-10-05',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Disponibilidad obtenida exitosamente',
  })
  findWithAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.sitesService.findWithAvailability(id, date);
  }

  @Get(':id/stats')
  @ApiOperation({ 
    summary: 'Obtener estadísticas de una sede',
    description: 'Obtiene estadísticas de uso y ocupación de una sede específica.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente',
  })
  getStats(@Param('id') id: string): Promise<any> {
    return this.sitesService.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una sede',
    description: 'Actualiza los datos de una sede existente. Requiere permisos de administrador.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sede actualizada exitosamente', 
    type: Site 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sede no encontrada' 
  })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.GLOBAL_ADMIN, UserRole.SITE_ADMIN)
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto): Promise<Site> {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Patch(':id/activate')
  @ApiOperation({ 
    summary: 'Activar una sede',
    description: 'Activa una sede previamente desactivada.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sede activada exitosamente', 
    type: Site 
  })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.GLOBAL_ADMIN)
  activate(@Param('id') id: string): Promise<Site> {
    return this.sitesService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Desactivar una sede',
    description: 'Desactiva una sede sin eliminar sus datos.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sede desactivada exitosamente', 
    type: Site 
  })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.GLOBAL_ADMIN)
  deactivate(@Param('id') id: string): Promise<Site> {
    return this.sitesService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar una sede',
    description: 'Elimina permanentemente una sede del sistema. Solo si no tiene reservas activas.' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la sede',
    example: 'SCL',
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Sede eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sede no encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'No se puede eliminar la sede porque tiene reservas activas' 
  })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.GLOBAL_ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.sitesService.remove(id);
  }
}