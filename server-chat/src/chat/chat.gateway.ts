import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Cấu hình CORS nếu cần thiết
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    return { event: 'joined', roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    return { event: 'left', roomId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    messageData: { roomId: string; senderId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.chatService.createMessage({
      chatRoomId: messageData.roomId,
      senderId: messageData.senderId,
      content: messageData.message,
    });

    this.server.to(messageData.roomId).emit('newMessage', savedMessage);
    console.log(client);
    return savedMessage;
  }
}
