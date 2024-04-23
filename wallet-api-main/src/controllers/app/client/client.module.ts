import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as Models from 'src/models';
import { AuthGuardService } from 'src/controllers/auth/guard/auth.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Models.User,
    ]),
    OrdersModule,
  ],
  controllers: [],
  providers: [
    AuthGuardService,
    JwtService,
  ]
})
export class ClientModule {}
