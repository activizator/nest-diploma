import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { HotelRoomService } from 'src/hotels/hotel.room.service';
import { Reservation, ReservationDto } from './reservations.dto';
import {
  ID,
  IReservation,
  ReservationSearchOptions,
} from './reservations.interfaces';
import { ReservationModel } from './reservations.model';
// Метод IReservation.addReservation должен проверять доступен ли номер на заданную дату

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(ReservationModel)
    private readonly reservationModel: ReturnModelType<typeof ReservationModel>,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const { hotelRoom, startDate, endDate, user } = data;
    const room = await this.hotelRoomService.findById(hotelRoom);
    const createdReservation = new this.reservationModel({
      userId: user,
      hotelId: room.hotel.id,
      roomId: hotelRoom,
      dateStart: startDate,
      dateEnd: endDate,
    });
    const answer = await createdReservation.save();

    const result = await this.reservationModel.aggregate([
      {
        $match: {
          _id: answer._id,
        },
      },
      {
        $lookup: {
          from: 'Hotel',
          localField: 'hotelId',
          foreignField: '_id',
          as: 'hotel',
        },
      },
      {
        $unwind: {
          path: '$hotel',
        },
      },
      {
        $lookup: {
          localField: 'roomId',
          from: 'HotelRoom',
          foreignField: '_id',
          as: 'room',
        },
      },
      {
        $unwind: {
          path: '$room',
        },
      },
      {
        $project: {
          _id: 0,
          startDate: '$dateStart',
          endDate: '$dateEnd',
          hotelRoom: {
            title: '$room.title',
            description: '$room.description',
            images: '$room.images',
          },
          hotel: {
            title: '$hotel.title',
            description: '$hotel.description',
          },
        },
      },
    ]);
    return result;
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    const { user, dateStart, dateEnd } = filter;
    // заглушка
    return await [
      {
        startDate: '2021-07-20',
        endDate: '2021-07-24',
        hotelRoom: {
          title: 'room.title',
          description: 'room.description',
          images: ['room.images'],
        },
        hotel: {
          title: 'room.hotel.title',
          description: 'room.hotel.description',
        },
      },
    ];
  }

  // async removeReservation(id: ID): Promise<void> {}
}
