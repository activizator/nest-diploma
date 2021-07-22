import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { MessageModel } from './chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: ReturnModelType<typeof MessageModel>,
  ) {}

  async createSupportRequest({ id, text }) {
    console.log(text);
    return [
      {
        id,
        createdAt: 'string',
        isActive: 'boolean',
        hasNewMessages: 'boolean',
      },
    ];
  }

  async sendMessage({ id, text }) {
    console.log(text);
    return [
      {
        id,
        createdAt: 'string',
        isActive: 'boolean',
        hasNewMessages: 'boolean',
      },
    ];
  }

  async getMessages({ userId, isActive, limit, offset }) {}

  async findSupportRequests({ userId, isActive, limit, offset }) {}

  async markMessagesAsRead({ id, createdBefore }) {}
}
