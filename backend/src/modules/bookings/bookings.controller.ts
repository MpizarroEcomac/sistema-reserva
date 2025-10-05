import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // TODO: Implementar endpoints REST para reservas
  // POST /bookings - Crear reserva
  // GET /bookings/mias - Mis reservas  
  // PATCH /bookings/:id - Editar reserva
  // DELETE /bookings/:id - Cancelar reserva
}