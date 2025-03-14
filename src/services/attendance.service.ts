import { AttendanceSessionModel, AttendanceRecordModel } from '@/models';
import { IAttendanceSession } from '@/models/attendance-session.model';
import { IAttendanceRecord } from '@/models/attendance-record.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Session operations
export async function createAttendanceSession(sessionData: Partial<IAttendanceSession>) {
  await connectToDatabase();
  return await AttendanceSessionModel.create(sessionData) as IAttendanceSession;
}

export async function getAttendanceSessionById(id: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.findById(id) as IAttendanceSession | null;
}

export async function getActiveSessionsByTeacher(teacherId: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({ 
    teacher: new mongoose.Types.ObjectId(teacherId),
    status: 'active'
  }).sort({ date: -1 }) as IAttendanceSession[];
}

export async function getAttendanceSessionsByClass(classId: string) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({ 
    class: new mongoose.Types.ObjectId(classId) 
  }).sort({ date: -1 }) as IAttendanceSession[];
}

export async function getTodaysSessions() {
  await connectToDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await AttendanceSessionModel.find({
    date: { $gte: today, $lt: tomorrow }
  }).sort({ startTime: 1 }) as IAttendanceSession[];
}

export async function getSessionsByDateRange(startDate: Date, endDate: Date) {
  await connectToDatabase();
  return await AttendanceSessionModel.find({
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1, startTime: 1 }) as IAttendanceSession[];
}

export async function updateAttendanceSession(sessionId: string, updateData: Partial<IAttendanceSession>) {
  await connectToDatabase();
  return await AttendanceSessionModel.findByIdAndUpdate(sessionId, updateData, { new: true }) as IAttendanceSession | null;
}

export async function deleteAttendanceSession(sessionId: string) {
  await connectToDatabase();
  
  // First delete all associated attendance records
  await AttendanceRecordModel.deleteMany({ session: new mongoose.Types.ObjectId(sessionId) });
  
  // Then delete the session
  return await AttendanceSessionModel.findByIdAndDelete(sessionId) as IAttendanceSession | null;
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
  ) as IAttendanceSession | null;
}

// Attendance Record operations
export async function createAttendanceRecord(recordData: Partial<IAttendanceRecord>) {
  await connectToDatabase();
  return await AttendanceRecordModel.create(recordData) as IAttendanceRecord;
}

export async function getAttendanceRecordById(id: string) {
  await connectToDatabase();
  return await AttendanceRecordModel.findById(id) as IAttendanceRecord | null;
}

export async function getAttendanceRecordsBySession(sessionId: string) {
  await connectToDatabase();
  return await AttendanceRecordModel.find({ session: new mongoose.Types.ObjectId(sessionId) }) as IAttendanceRecord[];
}

export async function getStudentAttendanceRecords(studentId: string, classId?: string) {
  await connectToDatabase();
  
  const query: any = { student: new mongoose.Types.ObjectId(studentId) };
  
  if (classId) {
    // Get all sessions for this class
    const sessions = await AttendanceSessionModel.find({ 
      class: new mongoose.Types.ObjectId(classId) 
    }).select('_id') as any[];
    
    const sessionIds = sessions.map(s => s._id);
    query.session = { $in: sessionIds };
  }
  
  return await AttendanceRecordModel.find(query)
    .populate('session')
    .sort({ 'session.date': -1 }) as any[];
}

export async function getAttendanceStatsByClass(classId: string) {
  await connectToDatabase();
  
  // Get all sessions for this class
  const sessions = await AttendanceSessionModel.find({ 
    class: new mongoose.Types.ObjectId(classId),
    status: 'completed'
  }) as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Aggregate attendance statistics
  return await AttendanceRecordModel.aggregate([
    { 
      $match: { 
        session: { $in: sessionIds } 
      } 
    },
    {
      $group: {
        _id: "$student",
        totalSessions: { $sum: 1 },
        presentCount: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
        },
        absentCount: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] }
        },
        lateCount: {
          $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] }
        },
        proxyCount: {
          $sum: { $cond: [{ $eq: ["$status", "proxy"] }, 1, 0] }
        },
        studentName: { $first: "$studentName" },
        rollNumber: { $first: "$rollNumber" }
      }
    },
    {
      $project: {
        _id: 1,
        student: "$_id",
        studentName: 1,
        rollNumber: 1,
        totalSessions: 1,
        presentCount: 1,
        absentCount: 1,
        lateCount: 1,
        proxyCount: 1,
        attendancePercentage: {
          $multiply: [
            { $divide: ["$presentCount", { $max: ["$totalSessions", 1] }] },
            100
          ]
        }
      }
    },
    { $sort: { attendancePercentage: -1 } }
  ]);
}

export async function getMonthlyAttendanceReport(month?: number, year?: number) {
  await connectToDatabase();
  
  const reportDate = new Date();
  if (month !== undefined && year !== undefined) {
    reportDate.setMonth(month);
    reportDate.setFullYear(year);
  }
  
  const startDate = startOfMonth(reportDate);
  const endDate = endOfMonth(reportDate);
  
  // Get all sessions in the month
  const sessions = await AttendanceSessionModel.find({
    date: { $gte: startDate, $lte: endDate },
    status: 'completed'
  }).sort({ date: 1 }) as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Get all attendance records for these sessions
  const records = await AttendanceRecordModel.find({
    session: { $in: sessionIds }
  }).populate('session').populate('student') as any[];
  
  return {
    month: reportDate.getMonth(),
    year: reportDate.getFullYear(),
    sessions,
    records
  };
}

export async function getLowAttendanceStudents(threshold = 75) {
  await connectToDatabase();
  
  // Get sessions from the last 3 months
  const threeMonthsAgo = subMonths(new Date(), 3);
  
  const sessions = await AttendanceSessionModel.find({
    date: { $gte: threeMonthsAgo },
    status: 'completed'
  }) as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Group by student and calculate percentages
  return await AttendanceRecordModel.aggregate([
    { 
      $match: { 
        session: { $in: sessionIds } 
      } 
    },
    {
      $group: {
        _id: "$student",
        totalSessions: { $sum: 1 },
        presentCount: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
        },
        studentName: { $first: "$studentName" },
        rollNumber: { $first: "$rollNumber" }
      }
    },
    {
      $project: {
        _id: 1,
        student: "$_id",
        studentName: 1,
        rollNumber: 1,
        totalSessions: 1,
        presentCount: 1,
        attendancePercentage: {
          $multiply: [
            { $divide: ["$presentCount", { $max: ["$totalSessions", 1] }] },
            100
          ]
        }
      }
    },
    { 
      $match: { 
        attendancePercentage: { $lt: threshold } 
      } 
    },
    { $sort: { attendancePercentage: 1 } }
  ]);
}

export async function updateAttendanceRecord(recordId: string, updateData: Partial<IAttendanceRecord>) {
  await connectToDatabase();
  return await AttendanceRecordModel.findByIdAndUpdate(recordId, updateData, { new: true }) as IAttendanceRecord | null;
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
  
  const session = await AttendanceSessionModel.findById(sessionId) as IAttendanceSession | null;
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
  }) as IAttendanceRecord | null;
  
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
    ) as IAttendanceRecord;
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

export async function getAttendanceByDateRange(startDate: Date, endDate: Date) {
  await connectToDatabase();
  
  // Get all sessions in the date range
  const sessions = await AttendanceSessionModel.find({
    date: { $gte: startDate, $lte: endDate },
    status: 'completed'
  }) as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Get all attendance records for these sessions
  return await AttendanceRecordModel.find({
    session: { $in: sessionIds }
  }).populate('session').populate('student') as any[];
}
