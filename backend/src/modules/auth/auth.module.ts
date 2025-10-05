import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // LocalStrategy,
    // JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}