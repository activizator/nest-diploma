import type { Types } from 'mongoose';
import { ReservationDto } from './reservations.dto';
import { ReservationModel } from './reservations.model';

export interface ID extends Types.ObjectId {}

interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<ReservationModel>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<ReservationModel>>;
}
