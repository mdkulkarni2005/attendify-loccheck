import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceSession extends Document {
  class: mongoose.Types.ObjectId;
  className: string;
  courseCode: string;
  teacher: mongoose.Types.ObjectId;
  teacherName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed';
  locationCheck: boolean;
  teacherLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  autoCloseAt?: Date;
}

const AttendanceSessionSchema = new Schema<IAttendanceSession>(
  {
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    className: { type: String, required: true },
    courseCode: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['scheduled', 'active', 'completed'],
      default: 'scheduled'
    },
    locationCheck: { type: Boolean, default: true },
    teacherLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      timestamp: { type: Date }
    },
    autoCloseAt: { type: Date }
  },
  { 
    timestamps: true 
  }
);

const AttendanceSessionModel = mongoose.models.AttendanceSession || 
  mongoose.model<IAttendanceSession>('AttendanceSession', AttendanceSessionSchema);

export default AttendanceSessionModel;