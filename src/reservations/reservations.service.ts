import { Injectable } from '@nestjs/common';

// interface ReservationDto {
//   user: ID;
//   hotel: ID;
//   room: ID;
//   dateStart: Date;
//   dateEnd: Date;
// }

// interface ReservationSearchOptions {
//   user: ID;
//   dateStart: Date;
//   dateEnd: Date;
// }
// interface IReservation {
//   addReservation(data: ReservationDto): Promise<Reservation>;
//   removeReservation(id: ID): Promise<void>;
//   getReservations(
//     filter: ReservationSearchOptions,
//   ): Promise<Array<Reservation>>;
// }

@Injectable()
export class ReservationsService {}
