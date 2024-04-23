import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import * as Models from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Models.FundsSource,
      Models.PaymentMethod,
    ])
  ],
  controllers: [GeneralController],
  providers: [GeneralService]
})
export class GeneralModule {}
