import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WSWrongClientRoleGuard } from 'src/auth/guards/roles.guard';
import { WsGuard } from 'src/auth/guards/ws.guard';
import { ChatService } from './chat.service';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  ) {
  }

  @WebSocketServer()
  server: any;

  @UseGuards(WsGuard)
  @UseGuards(WSWrongClientRoleGuard)
  @SubscribeMessage('wait messages')
  handleMessage(
    @MessageBody() message,
    @ConnectedSocket() client,
  ): Observable<WsResponse<any>> {
    return this.chatService.messages.pipe(
      filter((update) => update.requestId === message.requestId),
      map(({ message }) => ({
        event: 'message',
        data: message,
      })),
    );
  }
}
