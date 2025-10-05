import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../database/entities/resource.entity';
import { ResourceType } from '../../database/entities/resource-type.entity';
import { Booking } from '../../database/entities/booking.entity';

export interface ResourceAvailabilityQuery {
  siteId?: string;
  resourceTypeId?: number;
  date?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  bookingId?: number;
}

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(ResourceType)
    private resourceTypesRepository: Repository<ResourceType>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async findAll(query?: ResourceAvailabilityQuery): Promise<Resource[]> {
    const queryBuilder = this.resourcesRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.site', 'site')
      .leftJoinAndSelect('resource.resourceType', 'resourceType')
      .where('resource.isActive = :active', { active: true });

    if (query?.siteId) {
      queryBuilder.andWhere('resource.siteId = :siteId', { siteId: query.siteId });
    }

    if (query?.resourceTypeId) {
      queryBuilder.andWhere('resource.resourceTypeId = :resourceTypeId', { 
        resourceTypeId: query.resourceTypeId 
      });
    }

    queryBuilder.orderBy('resource.name', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourcesRepository.findOne({
      where: { id },
      relations: ['site', 'resourceType'],
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con ID '${id}' no encontrado`);
    }

    return resource;
  }

  async findByType(resourceTypeCode: string): Promise<Resource[]> {
    const resourceType = await this.resourceTypesRepository.findOne({
      where: { code: resourceTypeCode },
    });

    if (!resourceType) {
      throw new NotFoundException(`Tipo de recurso '${resourceTypeCode}' no encontrado`);
    }

    return this.resourcesRepository.find({
      where: { resourceTypeId: resourceType.id, isActive: true },
      relations: ['site', 'resourceType'],
      order: { name: 'ASC' },
    });
  }

  async findAvailability(resourceId: string, date: string): Promise<{
    resource: Resource;
    date: string;
    timeSlots: TimeSlot[];
  }> {
    const resource = await this.findOne(resourceId);
    
    // Obtener reservas existentes para la fecha
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);
    
    const existingBookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.resourceId = :resourceId', { resourceId })
      .andWhere('booking.startTime >= :startDate', { startDate })
      .andWhere('booking.startTime <= :endDate', { endDate })
      .andWhere('booking.status = :status', { status: 'active' })
      .orderBy('booking.startTime', 'ASC')
      .getMany();

    // Generar slots de tiempo (cada 30 minutos desde 8:00 hasta 20:00)
    const timeSlots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotEndHour = minute === 30 ? hour + 1 : hour;
        const slotEndMinute = minute === 30 ? 0 : 30;
        const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;
        
        const slotStartTime = new Date(`${date}T${slotStart}:00.000Z`);
        const slotEndTime = new Date(`${date}T${slotEnd}:00.000Z`);
        
        // Verificar si el slot está ocupado
        const conflictingBooking = existingBookings.find(booking => {
          return booking.startTime < slotEndTime && booking.endTime > slotStartTime;
        });
        
        timeSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
          available: !conflictingBooking,
          bookingId: conflictingBooking?.id,
        });
      }
    }

    return {
      resource,
      date,
      timeSlots,
    };
  }

  async getResourceTypes(): Promise<ResourceType[]> {
    return this.resourceTypesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }
}
