import type { ObjectId } from 'mongoose';

export interface HotelRoom {
  id?: ObjectId;
  title?: string;
  description?: string;
  images?: string[];
  isEnabled?: boolean;
  hotel?: {
    id?: ObjectId;
    title?: string;
    description?: string;
  };
}
