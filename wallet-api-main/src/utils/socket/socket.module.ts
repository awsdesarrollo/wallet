import { Module, Global } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Token, User } from 'src/models';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      Token,
      User
    ])
  ],
  exports: [
    SocketService
  ],
  providers: [
    SocketService
  ]
})
export class SocketModule {}
