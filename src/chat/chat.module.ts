import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { MessageModel, SupportRequestModel } from './chat.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [
    AuthModule,
    UsersModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: SupportRequestModel,
        schemaOptions: {
          collection: 'SupportRequest',
        },
      },
      {
        typegooseClass: MessageModel,
        schemaOptions: {
          collection: 'Message',
        },
      },
    ]),
  ],
})
export class ChatModule {}
