import mongoose = require('mongoose');
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

export interface Message {
  id?: ObjectId;
  text: string;
}

export interface SupportRequest {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}
