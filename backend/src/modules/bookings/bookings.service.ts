import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../database/entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  // TODO: Implementar método para crear reserva con validación anti-solapamiento
  async create(/* createBookingDto */): Promise<Booking> {
    // 1. Validar reglas de negocio (RuleSet)
    // 2. Verificar disponibilidad usando tsrange
    // 3. Crear reserva
    throw new Error('Method not implemented.');
  }

  // TODO: Implementar método para obtener reservas de un usuario
  async findByUser(/* userId: number */): Promise<Booking[]> {
    throw new Error('Method not implemented.');
  }

  // TODO: Implementar método para verificar disponibilidad
  async checkAvailability(/* resourceId: string, startTime: Date, endTime: Date */): Promise<boolean> {
    // Query con PostgreSQL tsrange para verificar solapamientos
    throw new Error('Method not implemented.');
  }

  // TODO: Implementar más métodos según se necesiten
}