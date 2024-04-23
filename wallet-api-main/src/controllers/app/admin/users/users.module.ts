import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FundsSource, Movement, Order, User } from 'src/models';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardService } from 'src/controllers/auth/guard/auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      FundsSource,
      Movement,
      Order,
      User,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    AuthGuardService,
    JwtService,
    UsersService,
  ]
})
export class UsersModule {}
