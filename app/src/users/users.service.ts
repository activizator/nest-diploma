import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './users.model';
import { genSalt, hash } from 'bcryptjs';
import { mongoose } from '@typegoose/typegoose';
import { IUserService } from './user.interfaces';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  async create(data) {
    const { email, password, name, contactPhone, role } = data;
    const sault = await genSalt(10);
    const passwordHash = await hash(password, sault);
    const createdUser = new this.userModel({
      email,
      passwordHash,
      name,
      contactPhone,
      role,
    });
    const answer = await createdUser.save();
    const aggrAns = await this.userModel
      .aggregate([
        { $match: { _id: answer._id } },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            name: 1,
            contactPhone: 1,
            role: 1,
          },
        },
      ])
      .exec();
    return aggrAns[0];
  }

  async findById(id) {
    const ObjectId = mongoose.Types.ObjectId;
    const aggr = { _id: ObjectId(id) };
    const aggrAns = await this.userModel
      .aggregate([
        {
          $match: aggr,
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            name: 1,
            contactPhone: 1,
          },
        },
      ])
      .exec();
    return aggrAns[0];
  }

  async findByEmail(email) {
    const aggr = { email };
    const aggrAns = await this.userModel
      .aggregate([
        {
          $match: aggr,
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            name: 1,
            contactPhone: 1,
            passwordHash: 1,
            role: 1,
          },
        },
      ])
      .exec();
    return aggrAns[0];
  }

  async findAll(params) {
    const { email, limit, offset, name, contactPhone } = params;
    const aggr = email
      ? { email }
      : {
          $and: [
            { name: { $regex: new RegExp(name, 'g') } },
            { contactPhone: { $regex: new RegExp(contactPhone, 'g') } },
          ],
        };
    const aggrAns = await this.userModel
      .aggregate([
        {
          $match: aggr,
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            name: 1,
            contactPhone: 1,
          },
        },
      ])
      .skip(offset)
      .limit(limit)
      .exec();
    return aggrAns;
  }
}
