
import { AttendanceSessionModel, AttendanceRecordModel } from '@/models';
import { IAttendanceSession } from '@/models/attendance-session.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function getAttendanceStatsByClass(classId: string) {
  await connectToDatabase();
  
  // Get all sessions for this class
  const sessions = await AttendanceSessionModel.find({ 
    class: new mongoose.Types.ObjectId(classId),
    status: 'completed'
  }) as unknown as IAttendanceSession[];
  
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
  }).sort({ date: 1 }) as unknown as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Get all attendance records for these sessions
  const records = await AttendanceRecordModel.find({
    session: { $in: sessionIds }
  }).populate('session').populate('student') as unknown as any;
  
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
  }) as unknown as IAttendanceSession[];
  
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

export async function getAttendanceByDateRange(startDate: Date, endDate: Date) {
  await connectToDatabase();
  
  // Get all sessions in the date range
  const sessions = await AttendanceSessionModel.find({
    date: { $gte: startDate, $lte: endDate },
    status: 'completed'
  }) as unknown as IAttendanceSession[];
  
  const sessionIds = sessions.map(s => s._id);
  
  // Get all attendance records for these sessions
  return await AttendanceRecordModel.find({
    session: { $in: sessionIds }
  }).populate('session').populate('student') as unknown as any;
}
