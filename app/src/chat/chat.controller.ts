import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Headers,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  ClientRoleGuard,
  ManagerOrClientRoleGuard,
  ManagerRoleGuard,
} from 'src/auth/guards/roles.guard';
import { ChatService } from './chat.service';
import { UIdService } from 'src/auth/uid.service';
import { UsersService } from 'src/users/users.service';

@Controller('/api/')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly uIdService: UIdService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientRoleGuard)
  @Post('/client/support-requests/')
  async supportRequests(@Body() body: { text: string }, @Headers() headers) {
    const { text } = body;
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const id = u.id;
    return await this.chatService.createSupportRequest({ id, text });
  }
 
  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerOrClientRoleGuard)
  @Post('/common/support-requests/:id/messages')
  async sendMessage(
    @Headers() headers,
    @Body() body: { text: string },
    @Param() params,
  ) {
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    const { text } = body;
    const id = params.id;
    return await this.chatService.sendMessage({ id, userId, text });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientRoleGuard)
  @Get('/client/support-requests/')
  async getSupportRequests(
    @Headers() headers,
    @Query('isActive') isActive?,
    @Query('limit') limit?,
    @Query('offset') offset?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    if (isActive === undefined) isActive = true;
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    return await this.chatService.findSupportRequests({
      userId,
      isActive,
      limit,
      offset,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerRoleGuard)
  @Get('/manager/support-requests/')
  async getMSupportRequests(
    @Query('isActive') isActive?,
    @Query('limit') limit?,
    @Query('offset') offset?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    if (isActive === undefined) isActive = true;
    const userId = 'forManagerAny';
    return await this.chatService.findSupportRequests({
      userId,
      isActive,
      limit,
      offset,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerOrClientRoleGuard)
  @Get('/common/support-requests/:id/messages')
  async getCorMSupportRequestsMesseges(
    @Headers() headers,
    @Param() params,
    @Query('isActive') isActive?,
    @Query('limit') limit?,
    @Query('offset') offset?,
  ) {
    const id = params.id;
    if (isActive === undefined) isActive = true;
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    return await this.chatService.getMessages({
      id,
      isActive,
      limit,
      offset,
      user: u,
    });
  }
  
  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerOrClientRoleGuard)
  @Post('/common/support-requests/:id/messages/read')
  async messagesRead(@Body() body: { createdBefore: string }, @Param() params) {
    const { createdBefore } = body;
    const id = params.id;
    return await this.chatService.markMessagesAsRead({ id, createdBefore });
  }
}
