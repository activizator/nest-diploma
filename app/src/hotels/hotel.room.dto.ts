import mongoose = require('mongoose');
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

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
