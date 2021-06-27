import { Injectable } from '@nestjs/common';
import type { Types } from 'mongoose';

interface ID extends Types.ObjectId {}

interface ReservationDto {
  user: ID;
  hotel: ID;
  room: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface Reservation {
  startDate: string;
  endDate: string;
  hotelRoom: {
    title: string;
    description: string;
    images: [string];
  };
  hotel: {
    title: string;
    description: string;
  };
}

interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}
interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationsService {
  //implements IReservation
  //   async addReservation(data: ReservationDto): Promise<Reservation> {}
  //   async removeReservation(id: ID): Promise<void> {}
  //   async getReservations(
  //     filter: ReservationSearchOptions,
  //   ): Promise<Array<Reservation>> {}
}
