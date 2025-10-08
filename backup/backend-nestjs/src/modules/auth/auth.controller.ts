import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: Implementar endpoints de autenticación
  // POST /auth/login - Iniciar sesión
  // POST /auth/register - Registrar usuario
  // POST /auth/logout - Cerrar sesión
  // GET /auth/profile - Obtener perfil del usuario autenticado
}