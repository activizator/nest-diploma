import mongoose = require('mongoose');
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

export interface Hotel {
  id?: ObjectId;
  title?: string;
  description?: string;
}
