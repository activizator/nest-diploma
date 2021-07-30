import { Injectable } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { HotelRoomModel } from './hotels.models';
import { HotelRoom } from './hotel.room.dto';
import { IHotelRoomService } from './hotels.interfaces';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoomModel)
    private readonly hotelRoomModel: ReturnModelType<typeof HotelRoomModel>,
  ) {}

  async findById(id): Promise<HotelRoom> {
    const ObjectId = mongoose.Types.ObjectId;
    const ans = await this.hotelRoomModel
      .aggregate([
        { $match: { _id: ObjectId(id) } },
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
            description: '$description',
            images: '$images',
            hotel: {
              id: '$result._id',
              title: '$result.title',
              description: '$result.description',
            },
          },
        },
      ])
      .exec();
    return ans[0];
  }

  async search(params): Promise<HotelRoom[]> {
    let { hotel } = params;
    const { limit, offset } = params;
    const ObjectId = mongoose.Types.ObjectId;
    hotel = hotel ? ObjectId(hotel) : { $exists: true };
    return await this.hotelRoomModel
      .aggregate([
        { $match: { hotel } },
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
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async create(params) {
    const { title, description, hotel, images, isEnabled } = params;
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

  async update(params) {
    const { id, title, description, hotel, images, isEnabled } = params;
    const answer = await this.hotelRoomModel.findOneAndUpdate(
      { _id: id },
      {
        hotel,
        title,
        description,
        images,
        isEnabled,
      },
      { upsert: true, useFindAndModify: false },
    );
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
