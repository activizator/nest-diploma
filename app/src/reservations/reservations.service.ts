import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { HotelRoomService } from 'src/hotels/hotel.room.service';
import { CheckDates } from './check.dates';
import { Reservation, ReservationDto } from './reservations.dto';
import {
  ID,
  IReservation,
  ReservationSearchOptions,
} from './reservations.interfaces';
import { ReservationModel } from './reservations.model';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(ReservationModel)
    private readonly reservationModel: ReturnModelType<typeof ReservationModel>,
    private readonly hotelRoomService: HotelRoomService,
    private readonly checkDates: CheckDates,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const { hotelRoom, startDate, endDate, user } = data;
    const ObjectId = mongoose.Types.ObjectId;
    try {
      const room = await this.hotelRoomService.findById(hotelRoom);
      const reservations = await this.reservationModel
        .find({
          roomId: ObjectId(hotelRoom),
        })
        .exec();

      const unavailableRoom = reservations.some((element) => {
        return this.checkDates.check(startDate, element) || this.checkDates.check(endDate, element);
      });

      if(unavailableRoom) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
          },
          400,
        );
      }

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
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Номер не найден или занят в выбранные даты',
        },
        400,
      );
    }
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

  async removeReservation(userId: ID, reservationId: ID): Promise<void> {
    try {
      await this.reservationModel.deleteOne({ _id: reservationId, userId });
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Информация не найдена',
        },
        400,
      );
    }
  }
}
