import type { Types } from 'mongoose';
import { Reservation, ReservationDto } from './reservations.dto';
import { ReservationModel } from './reservations.model';

export interface ID extends Types.ObjectId {}

export interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  // removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
