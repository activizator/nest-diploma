import { Injectable } from '@nestjs/common';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
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
    const ObjectId = mongoose.Types.ObjectId;
    const dS = !dateStart ? { $exists: true } : { $gte: new Date(dateStart) };
    const dE = !dateEnd ? { $exists: true } : { $lte: new Date(dateEnd) };
    const result = await this.reservationModel.aggregate([
      {
        $match: {
          userId: ObjectId(user),
          dateStart: dS,
          dateEnd: dE,
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

  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не client
  // 403 - если id текущего пользователя не совпадает с id пользователя в брони
  // 400 - если бронь с указанным ID не существует
  async removeReservation(id: ID): Promise<void> {
    await this.reservationModel.deleteOne({ _id: id });
  }
}
