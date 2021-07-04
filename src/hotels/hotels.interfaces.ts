import { Hotel } from './hotel.dto';
import type { Types } from 'mongoose';
import { HotelRoom } from './hotel.room.dto';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  update(data: any): Promise<Hotel>;
  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]>;
}

interface ID extends Types.ObjectId {}

interface SearchRoomsParams {
  hotel: string;
  limit: number;
  offset: number;
  isEnabled?: true;
}

export interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
