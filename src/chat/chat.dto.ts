import type { ObjectId } from 'mongoose';

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
