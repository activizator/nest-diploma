import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class UserModel extends Base {
  @prop({ unique: true, required: true })
  email: string;

  @prop({ unique: true, required: true })
  passwordHash: string;

  @prop({ required: true })
  name: string;

  @prop()
  contactPhone: string;

  @prop({ required: true, default: 'client' })
  role: string;
}
