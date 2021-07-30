import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReservationModel } from './reservations.model';
import { HotelsModule } from 'src/hotels/hotels.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CheckDates } from './check.dates';

@Module({
  providers: [ReservationsService, CheckDates],
  controllers: [ReservationsController],
  imports: [
    UsersModule,
    AuthModule,
    HotelsModule,
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
