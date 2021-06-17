import { Injectable } from '@nestjs/common';

// interface IHotelService {
//   create(data: any): Promise<Hotel>;
//   findById(id: ID): Promise<Hotel>;
//   search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
// }

// interface SearchRoomsParams {
//   limit: number;
//   offset: number;
//   title: string;
//   isEnabled?: true;
// }

// interface HotelRoomService {
//   create(data: Partial<HotelRoom>): Promise<HotelRoom>;
//   findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
//   search(params: SearchRoomsParams): Promise<HotelRoom[]>;
//   update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
// }

@Injectable()
export class HotelsService {
  findAll() {
    return { message: 'hi' };
  }
}
