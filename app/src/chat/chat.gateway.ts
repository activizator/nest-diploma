import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WSWrongClientRoleGuard } from 'src/auth/guards/roles.guard';
import { WsGuard } from 'src/auth/guards/ws.guard';
import { UIdService } from 'src/auth/uid.service';
import { ChatService } from './chat.service';

const options = {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, authorization, x-token',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '1728000',
      'Content-Length': '0',
    };
    res.writeHead(200, headers);
    res.end();
  },
};

@WebSocketGateway(options)
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly uIdService: UIdService,
  ) {}
  @WebSocketServer()
  server: any;

  @UseGuards(WsGuard)
  @UseGuards(WSWrongClientRoleGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message,
    @ConnectedSocket() client,
  ): Promise<void> {
    try {
      const data = message.data;
      const auth = client.handshake.headers.authorization;
      const user = await this.uIdService.getUser(auth);
      if (data.indexOf('subscribeToChat payload') !== -1) {
        const pos = data.lastIndexOf(':');
        const id = data.slice(pos + 1).trim();
        const isActive = true;
        const limit = 100;
        const offset = 0;
        const ans = await this.chatService.getMessages({
          id,
          isActive,
          limit,
          offset,
          user,
        });
        client.emit('message', { data: JSON.stringify(ans) });
      }
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Запрошенная информация не найдена',
        },
        400,
      );
    }
  }
}
