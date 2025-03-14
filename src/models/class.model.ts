import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  courseCode: string;
  department: string;
  room: string;
  teacher: mongoose.Types.ObjectId;
  teacherName: string;
  totalStudents: number;
  schedule: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    room: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherName: { type: String, required: true },
    totalStudents: { type: Number, default: 0 },
    schedule: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      radius: { type: Number, required: true, default: 50 }
    }
  },
  { 
    timestamps: true 
  }
);

const ClassModel = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default ClassModel;