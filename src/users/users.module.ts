import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserModel } from './users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
  ],
})
export class UsersModule {}
