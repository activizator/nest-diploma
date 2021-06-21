import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface HotelModel extends Base {}
export class HotelModel extends TimeStamps {
  @prop({ required: true })
  title: string;

  @prop()
  description: string;
}

export interface HotelRoomModel extends Base {}
export class HotelRoomModel extends TimeStamps {
  @prop({ required: true, ref: HotelModel })
  hotel: Ref<HotelModel>;

  @prop({ required: true })
  title: string;

  @prop()
  description: string;

  @prop({ type: () => [String] })
  images: string[];

  @prop({ required: true, default: true })
  isEnabled: boolean;
}
