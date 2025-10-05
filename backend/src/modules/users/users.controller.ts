import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Implementar endpoints REST para usuarios
  // GET /users/profile - Mi perfil
  // PATCH /users/profile - Actualizar perfil
  // GET /users - Listar usuarios (admin)
  // POST /users - Crear usuario (admin)
}