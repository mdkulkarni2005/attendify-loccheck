
import { AttendanceRecordModel, AttendanceSessionModel } from '@/models';
import { IAttendanceRecord } from '@/models/attendance-record.model';
import { IAttendanceSession } from '@/models/attendance-session.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function createAttendanceRecord(recordData: Partial<IAttendanceRecord>) {
  await connectToDatabase();
  return await AttendanceRecordModel.create(recordData) as unknown as IAttendanceRecord;
}

export async function getAttendanceRecordById(id: string) {
  await connectToDatabase();
  return await AttendanceRecordModel.findById(id) as unknown as IAttendanceRecord | null;
}

export async function getAttendanceRecordsBySession(sessionId: string) {
  await connectToDatabase();
  return await AttendanceRecordModel.find({ session: new mongoose.Types.ObjectId(sessionId) }) as unknown as IAttendanceRecord[];
}

export async function getStudentAttendanceRecords(studentId: string, classId?: string) {
  await connectToDatabase();
  
  const query: any = { student: new mongoose.Types.ObjectId(studentId) };
  
  if (classId) {
    // Get all sessions for this class
    const sessions = await AttendanceSessionModel.find({ 
      class: new mongoose.Types.ObjectId(classId) 
    }).select('_id') as unknown as any[];
    
    const sessionIds = sessions.map(s => s._id);
    query.session = { $in: sessionIds };
  }
  
  return await AttendanceRecordModel.find(query)
    .populate('session')
    .sort({ 'session.date': -1 }) as unknown as any;
}

export async function updateAttendanceRecord(recordId: string, updateData: Partial<IAttendanceRecord>) {
  await connectToDatabase();
  return await AttendanceRecordModel.findByIdAndUpdate(recordId, updateData, { new: true }) as unknown as IAttendanceRecord | null;
}

export async function markAttendance(
  sessionId: string, 
  studentId: string, 
  status: 'present' | 'absent' | 'late' | 'proxy',
  locationData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    distance: number;
  }
) {
  await connectToDatabase();
  
  const session = await AttendanceSessionModel.findById(sessionId) as unknown as IAttendanceSession | null;
  if (!session) {
    throw new Error('Attendance session not found');
  }
  
  if (session.status !== 'active') {
    throw new Error('Attendance session is not active');
  }
  
  // Check if a record already exists
  const existingRecord = await AttendanceRecordModel.findOne({
    session: new mongoose.Types.ObjectId(sessionId),
    student: new mongoose.Types.ObjectId(studentId)
  }) as unknown as IAttendanceRecord | null;
  
  if (existingRecord) {
    // Update existing record
    const updateData: any = { status };
    
    if (locationData) {
      updateData.locationData = {
        ...locationData,
        timestamp: new Date()
      };
    }
    
    return await AttendanceRecordModel.findByIdAndUpdate(
      existingRecord._id,
      updateData,
      { new: true }
    ) as unknown as IAttendanceRecord;
  } else {
    // Create new record
    const recordData: any = {
      session: sessionId,
      student: studentId,
      status
    };
    
    if (locationData) {
      recordData.locationData = {
        ...locationData,
        timestamp: new Date()
      };
    }
    
    return createAttendanceRecord(recordData);
  }
}
