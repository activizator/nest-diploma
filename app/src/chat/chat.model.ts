import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/users/users.model';
import { Message } from './chat.dto';

export interface SupportRequestModel extends Base {}
export class SupportRequestModel extends TimeStamps {
  @prop({ required: true, ref: UserModel })
  user: Ref<UserModel>;

  @prop({ type: () => [Object] })
  messages: Message[];

  @prop({ required: true, default: true })
  isActive: boolean;
}

export class MessageModel extends Base {
  @prop({ required: true, ref: UserModel })
  author: Ref<UserModel>;
  @prop({ required: true })
  text: string;
  @prop({ required: true })
  sentAt: Date;
  @prop()
  readAt: Date;
}
