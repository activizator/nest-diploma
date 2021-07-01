import { Injectable } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { HotelModel, HotelRoomModel } from './hotels.models';
import type { Types } from 'mongoose';
import { HotelRoom } from './hotel.room.dto';

interface ID extends Types.ObjectId {}

interface SearchRoomsParams {
  hotel: string;
  limit: number;
  offset: number;
  isEnabled?: true;
}

interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelModel)
    private readonly hotelModel: ReturnModelType<typeof HotelModel>,
    @InjectModel(HotelRoomModel)
    private readonly hotelRoomModel: ReturnModelType<typeof HotelRoomModel>,
  ) {}

  async findById(id): Promise<HotelRoom> {
    const ObjectId = mongoose.Types.ObjectId;
    return await this.hotelRoomModel
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
            images: '$images',
            hotel: { id: '$result._id', title: '$result.title' },
          },
        },
      ])
      .exec();
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
