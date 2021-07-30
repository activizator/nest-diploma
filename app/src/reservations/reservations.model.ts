import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/users/users.model';
import { HotelModel, HotelRoomModel } from 'src/hotels/hotels.models';

export class ReservationModel extends Base {
  @prop({ required: true, ref: UserModel })
  userId: Ref<UserModel>;

  @prop({ required: true, ref: HotelModel })
  hotelId: Ref<HotelModel>;

  @prop({ required: true, ref: HotelRoomModel })
  roomId: Ref<HotelRoomModel>;

  @prop({ required: true })
  dateStart: Date;

  @prop({ required: true })
  dateEnd: Date;
}
