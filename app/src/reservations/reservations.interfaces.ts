import type { Types } from 'mongoose';
import { Reservation, ReservationDto } from './reservations.dto';

export interface ID extends Types.ObjectId {}

export interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(userId: ID, reservationId: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
