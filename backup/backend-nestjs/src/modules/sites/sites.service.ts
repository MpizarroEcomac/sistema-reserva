import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../../database/entities/site.entity';
import { Resource } from '../../database/entities/resource.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    // Verificar que el ID no exista
    const existingSite = await this.sitesRepository.findOne({
      where: { id: createSiteDto.id },
    });

    if (existingSite) {
      throw new ConflictException(`La sede con ID '${createSiteDto.id}' ya existe`);
    }

    const site = this.sitesRepository.create(createSiteDto);
    return this.sitesRepository.save(site);
  }

  async findAll(includeInactive = false): Promise<Site[]> {
    const queryBuilder = this.sitesRepository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.resources', 'resource', 'resource.isActive = :resourceActive', { resourceActive: true })
      .leftJoinAndSelect('resource.resourceType', 'resourceType')
      .orderBy('site.name', 'ASC')
      .addOrderBy('resource.name', 'ASC');

    if (!includeInactive) {
      queryBuilder.where('site.isActive = :active', { active: true });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.sitesRepository.findOne({
      where: { id },
      relations: ['resources', 'resources.resourceType', 'ruleSets'],
    });

    if (!site) {
      throw new NotFoundException(`Sede con ID '${id}' no encontrada`);
    }

    return site;
  }

  async findWithAvailability(siteId: string, date: string): Promise<any> {
    const site = await this.findOne(siteId);
    
    // TODO: Implementar lógica de disponibilidad
    // Aquí iría la consulta compleja que obtiene:
    // - Todos los recursos de la sede
    // - Las reservas existentes para la fecha
    // - Los slots disponibles según las reglas
    
    return {
      site,
      date,
      resources: site.resources.map(resource => ({
        ...resource,
        availability: [], // Array de slots disponibles
        bookings: [], // Reservas existentes
      })),
    };
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const site = await this.findOne(id);
    
    Object.assign(site, updateSiteDto);
    return this.sitesRepository.save(site);
  }

  async remove(id: string): Promise<void> {
    const site = await this.findOne(id);
    
    // Verificar que no tenga reservas activas
    const activeBookingsCount = await this.resourcesRepository
      .createQueryBuilder('resource')
      .leftJoin('resource.bookings', 'booking')
      .where('resource.siteId = :siteId', { siteId: id })
      .andWhere('booking.status = :status', { status: 'active' })
      .andWhere('booking.startTime > :now', { now: new Date() })
      .getCount();

    if (activeBookingsCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la sede '${id}' porque tiene ${activeBookingsCount} reservas activas`
      );
    }

    await this.sitesRepository.remove(site);
  }

  async activate(id: string): Promise<Site> {
    const site = await this.findOne(id);
    site.isActive = true;
    return this.sitesRepository.save(site);
  }

  async deactivate(id: string): Promise<Site> {
    const site = await this.findOne(id);
    site.isActive = false;
    return this.sitesRepository.save(site);
  }

  // Método de utilidad para obtener estadísticas de una sede
  async getStats(siteId: string): Promise<any> {
    const site = await this.findOne(siteId);
    
    const stats = await this.resourcesRepository
      .createQueryBuilder('resource')
      .leftJoin('resource.bookings', 'booking')
      .select([
        'COUNT(DISTINCT resource.id) as total_resources',
        'COUNT(DISTINCT CASE WHEN resource.resourceType.code = \'sala\' THEN resource.id END) as salas',
        'COUNT(DISTINCT CASE WHEN resource.resourceType.code = \'parking\' THEN resource.id END) as parking_spaces',
        'COUNT(DISTINCT CASE WHEN booking.status = \'active\' AND booking.startTime > NOW() THEN booking.id END) as active_bookings',
        'COUNT(DISTINCT CASE WHEN booking.createdAt >= CURRENT_DATE - INTERVAL \'30 days\' THEN booking.id END) as bookings_last_30_days',
      ])
      .where('resource.siteId = :siteId', { siteId })
      .getRawOne();

    return {
      site: {
        id: site.id,
        name: site.name,
        timezone: site.timezone,
        isActive: site.isActive,
      },
      stats: {
        totalResources: parseInt(stats.total_resources) || 0,
        salas: parseInt(stats.salas) || 0,
        parkingSpaces: parseInt(stats.parking_spaces) || 0,
        activeBookings: parseInt(stats.active_bookings) || 0,
        bookingsLast30Days: parseInt(stats.bookings_last_30_days) || 0,
      },
    };
  }
}