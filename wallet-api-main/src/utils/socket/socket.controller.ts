import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import SocketEvents from './socket.events';
import { SocketService } from './socket.service';
import { ApprovedOrderDto, RejectedOrderDto, UpdatedUserDTO, UserIdDTO } from './socket.entity';

@WebSocketGateway()
export class SocketController {

   @WebSocketServer() server: Server;

   constructor(private readonly socketService: SocketService) {}

   // Auth
   @SubscribeMessage(SocketEvents.AUTH.LOGIN)
   async login(@MessageBody() body: UserIdDTO, @ConnectedSocket() client: Socket) {
      // Inserta el usuario a una room para enviar mensajes individuales
      if (!body.user_id) return;
      client.join(String(body.user_id), (err) => {});
   }

   @SubscribeMessage(SocketEvents.AUTH.LOGOUT)
   async logout(@MessageBody() body: UserIdDTO, @ConnectedSocket() client: Socket) {
      // Elimina el usuario del room
      if (!body.user_id) return;
      client.leave(String(body.user_id), (err) => {});
   }

   // User
   @SubscribeMessage(SocketEvents.USER.UPDATED_USER)
   async updatedUser(@MessageBody() body: UpdatedUserDTO) {
      this.server.emit(SocketEvents.USER.UPDATED_USER, body);
   }

   // Order
   @SubscribeMessage(SocketEvents.ORDER.APPROVED)
   async approvedOrder(@MessageBody() body: ApprovedOrderDto) {
      this.socketService.approvedOrder(body);
      this.server.emit(SocketEvents.ORDER.APPROVED, body);
   }

   @SubscribeMessage(SocketEvents.ORDER.REJECTED)
   async rejectedOrder(@MessageBody() body: RejectedOrderDto) {
      this.socketService.rejectedOrder(body);
      this.server.emit(SocketEvents.ORDER.REJECTED, body);
   }
}