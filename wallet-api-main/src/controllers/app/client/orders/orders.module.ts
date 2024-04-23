import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, PaymentMethod, User } from 'src/models';
import { AuthGuardService } from 'src/controllers/auth/guard/auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      PaymentMethod,
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
