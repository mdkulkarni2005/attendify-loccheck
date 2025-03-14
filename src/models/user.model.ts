import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  phoneNumber?: string;
  class?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { 
      type: String, 
      required: true, 
      enum: ['student', 'teacher', 'admin', 'clerk'],
      default: 'student' 
    },
    department: { type: String },
    rollNumber: { type: String },
    phoneNumber: { type: String },
    class: { type: String },
  }, 
  { 
    timestamps: true 
  }
);

// Only register the model once to avoid the "Cannot overwrite model once compiled" error
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;