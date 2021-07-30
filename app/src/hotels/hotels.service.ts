import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { HotelModel } from './hotels.models';
import { Hotel } from './hotel.dto';
import { IHotelService } from './hotels.interfaces';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(HotelModel)
    private readonly hotelModel: ReturnModelType<typeof HotelModel>,
  ) {}

  async create(data): Promise<Hotel> {
    const { title, description } = data;
    const createdHotel = new this.hotelModel({ title, description });
    const answer = await createdHotel.save();
    const ans = await this.hotelModel.aggregate([
      { $match: { _id: answer._id } },
      { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
    ]);
    return ans[0];
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

  async update(data): Promise<Hotel> {
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
    const ans = await this.hotelModel.aggregate([
      { $match: { _id: answer._id } },
      { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
    ]);
    return ans[0];
  }
}
