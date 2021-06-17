import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UserModel } from './user.model';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
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
export class ClientsModule {}
