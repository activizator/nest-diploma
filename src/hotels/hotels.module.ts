import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { HotelModel, HotelRoomModel } from './hotels.models';
import { TypegooseModule } from 'nestjs-typegoose';
import { HotelRoomService } from './hotel.room.service';

@Module({
  providers: [HotelsService, HotelRoomService],
  controllers: [HotelsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: HotelModel,
        schemaOptions: {
          collection: 'Hotel',
        },
      },
      {
        typegooseClass: HotelRoomModel,
        schemaOptions: {
          collection: 'HotelRoom',
        },
      },
    ]),
  ],
})
export class HotelsModule {}
