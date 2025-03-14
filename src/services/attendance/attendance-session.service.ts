
import { AttendanceSessionModel } from '@/models';
import { IAttendanceSession } from '@/models/attendance-session.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Session operations
export async function createAttendanceSession(sessionData: Partial<IAttendanceSession>) {
  await connectToDatabase();
  return await AttendanceSessionModel.create(sessionData) as unknown as IAttendanceSession;
}

export async function getAttendanceSessionById(id: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.findById(id) as unknown as IAttendanceSession | null;
}

export async function getActiveSessionsByTeacher(teacherId: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({ 
    teacher: new mongoose.Types.ObjectId(teacherId),
    status: 'active'
  }).sort({ date: -1 }) as unknown as IAttendanceSession[];
}

export async function getAttendanceSessionsByClass(classId: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({ 
    class: new mongoose.Types.ObjectId(classId) 
  }).sort({ date: -1 }) as unknown as IAttendanceSession[];
}

export async function getTodaysSessions() {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await AttendanceSessionModel.find({
    date: { $gte: today, $lt: tomorrow }
  }).sort({ startTime: 1 }) as unknown as IAttendanceSession[];
}

export async function getSessionsByDateRange(startDate: Date, endDate: Date) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1, startTime: 1 }) as unknown as IAttendanceSession[];
}

export async function updateAttendanceSession(sessionId: string, updateData: Partial<IAttendanceSession>) {
  await connectToDatabase();
  return await AttendanceSessionModel.findByIdAndUpdate(sessionId, updateData, { new: true }) as unknown as IAttendanceSession | null;
}

export async function deleteAttendanceSession(sessionId: string) {
  await connectToDatabase();
  
  // First delete all associated attendance records
  await AttendanceRecordModel.deleteMany({ session: new mongoose.Types.ObjectId(sessionId) }) as unknown as any;
  
  // Then delete the session
  return await AttendanceSessionModel.findByIdAndDelete(sessionId) as unknown as IAttendanceSession | null;
}

export async function completeAttendanceSession(sessionId: string, teacherLocation?: {
  latitude: number;
  longitude: number;
}) {
  await connectToDatabase();
  
  const updateData: any = { status: 'completed' };
  
  if (teacherLocation) {
    updateData.teacherLocation = {
      ...teacherLocation,
      timestamp: new Date()
    };
  }
  
  return await AttendanceSessionModel.findByIdAndUpdate(
    sessionId,
    updateData,
    { new: true }
  ) as unknown as IAttendanceSession | null;
}

// Need to import this for deleteAttendanceSession
import { AttendanceRecordModel } from '@/models';
