import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, PasswordReset, Token } from 'src/models';
import { AuthGuardService } from './guard/auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      PasswordReset,
      Token,
    ])
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    AuthGuardService,
    JwtService,
  ]
})
export class AuthModule {}
