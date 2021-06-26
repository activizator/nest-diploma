import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { HotelModel, HotelRoomModel } from './hotels.models';
import { Hotel } from './hotel.dto';

interface IHotelService {
  create(data: any): Promise<Hotel>;
  update(data: any): Promise<Hotel>;
  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
}

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(HotelModel)
    private readonly hotelModel: ReturnModelType<typeof HotelModel>,
    @InjectModel(HotelRoomModel)
    private readonly hotelRoomModel: ReturnModelType<typeof HotelRoomModel>,
  ) {}

  async create(data) {
    const { title, description } = data;
    const createdHotel = new this.hotelModel({ title, description });
    const answer = await createdHotel.save();
    return {
      id: answer._id,
      title: answer.title,
      description: answer.description,
    };
  }

  async search(params) {
    const { limit, offset } = params;
    return await this.hotelModel
      .aggregate([
        { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
      ])
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async update(data) {
    const { id, hotel } = data;
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
}
