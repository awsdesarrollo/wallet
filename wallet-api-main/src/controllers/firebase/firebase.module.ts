import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { Token } from 'src/models';
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([Token])
  ],
  controllers: [
    FirebaseController
  ],
  providers: [
    FirebaseService
  ]
})
export class FirebaseModule {}
