import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardService } from './auth.service';
import { User } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([ User ]),
  ],
  providers: [
    AuthGuardService,
    JwtService,
  ],
})
export class AuthGuardModule {}
