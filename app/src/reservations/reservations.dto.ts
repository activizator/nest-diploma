import { ID } from './reservations.interfaces';

export interface ReservationDto {
  hotelRoom: ID;
  startDate: string;
  endDate: string;
  user?: ID;
}

export interface Reservation {
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
