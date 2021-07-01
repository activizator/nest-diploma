import type { ObjectId } from 'mongoose';

export interface Hotel {
  id?: ObjectId;
  title?: string;
  description?: string;
}
