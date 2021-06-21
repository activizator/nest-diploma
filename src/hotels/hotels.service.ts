import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { HotelModel, HotelRoomModel } from './hotels.models';

// interface IHotelService {
//   create(data: any): Promise<Hotel>;
//   findById(id: ID): Promise<Hotel>;
//   search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
// }

// interface SearchRoomsParams {
//   limit: number;
//   offset: number;
//   title: string;
//   isEnabled?: true;
// }

// interface HotelRoomService {
//   create(data: Partial<HotelRoom>): Promise<HotelRoom>;
//   findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
//   search(params: SearchRoomsParams): Promise<HotelRoom[]>;
//   update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
// }

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(HotelModel)
    private readonly hotelModel: ReturnModelType<typeof HotelModel>,
    @InjectModel(HotelRoomModel)
    private readonly hotelRoomModel: ReturnModelType<typeof HotelRoomModel>,
  ) {}

  async findAllRooms(hotel, limit, offset) {
    //     Формат ответа
    // [
    //   {
    //     "id": string,
    //     "title": string,
    //     "images": [string],
    //     "hotel": {
    //       "id": string,
    //       "title": string
    //     }
    //   }
    // ]
    return { message: 'hi', limit, offset, hotel };
  }

  async findTheRoom(id) {
    return await this.hotelRoomModel.findById(id).exec();
  }

  async addNewHotel(title, description) {
    const createdHotel = new this.hotelModel({ title, description });
    const answer = await createdHotel.save();
    return {
      id: answer._id,
      title: answer.title,
      description: answer.description,
    };
  }

  async findAllHotels(limit, offset) {
    return await this.hotelModel
      .aggregate([
        { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
      ])
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async changeTheHotelDesc(id, hotel) {
    const { title, description } = hotel;
    const answer = await this.hotelModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
      },
      { upsert: true, useFindAndModify: false },
    );
    return {
      id: answer._id,
      title: answer.title,
      description: answer.description,
    };
  }

  async addNewRoom(title, description, hotel, images, isEnabled) {
    const createdRoom = new this.hotelRoomModel({
      title,
      description,
      hotel,
      images,
      isEnabled,
    });
    const answer = await createdRoom.save();
    return await this.hotelRoomModel
      .aggregate([
        { $match: { _id: answer._id } },
        {
          $lookup: {
            from: 'Hotel',
            localField: 'hotel',
            foreignField: '_id',
            as: 'result',
          },
        },
        { $unwind: '$result' },
        {
          $project: {
            _id: 0,
            id: '$_id',
            title: '$title',
            images: '$images',
            hotel: { id: '$result._id', title: '$result.title' },
          },
        },
      ])
      .exec();
  }
}
