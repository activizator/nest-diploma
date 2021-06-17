import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface HotelModel extends TimeStamps {}
export class HotelModel extends Base {
  @prop({ required: true })
  title: string;

  @prop()
  descrititleption: string;
}

export interface HotelRoomModel extends TimeStamps {}
export class HotelRoomModel extends Base {
  @prop({ required: true, ref: HotelModel })
  hotel: Ref<HotelModel>;

  @prop()
  description: string;

  @prop({ type: () => [String] })
  images: string[];

  @prop({ required: true, default: true })
  isEnabled: boolean;
}
