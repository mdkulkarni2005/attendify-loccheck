import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord extends Document {
  session: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'proxy';
  locationData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    distance: number;
    timestamp: Date;
  };
  markedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    session: { type: Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['present', 'absent', 'late', 'proxy'],
      default: 'absent'
    },
    locationData: {
      latitude: { type: Number },
      longitude: { type: Number },
      accuracy: { type: Number },
      distance: { type: Number },
      timestamp: { type: Date }
    },
    markedAt: { type: Date, default: Date.now }
  },
  { 
    timestamps: true 
  }
);

// Create a compound index to ensure a student can only have one record per session
AttendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

const AttendanceRecordModel = mongoose.models.AttendanceRecord || 
  mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);

export default AttendanceRecordModel;