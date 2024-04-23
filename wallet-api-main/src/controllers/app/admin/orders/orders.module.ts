import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, User } from 'src/models';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardService } from 'src/controllers/auth/guard/auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    AuthGuardService,
    JwtService,
    OrdersService,
  ]
})
export class OrdersModule {}
