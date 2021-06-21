import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReservationModel } from './reservations.model';

@Module({
  providers: [ReservationsService],
  controllers: [ReservationsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReservationModel,
        schemaOptions: {
          collection: 'Reservation',
        },
      },
    ]),
  ],
})
export class ReservationsModule {}
