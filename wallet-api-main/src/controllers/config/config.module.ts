import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { Config } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Config])
  ],
  controllers: [ConfigController],
  providers: [ConfigService]
})
export class ConfigModule {}
