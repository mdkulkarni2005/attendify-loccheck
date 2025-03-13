
export type UserRole = 'teacher' | 'student' | 'clerk';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  rollNumber?: string; // For students
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  courseCode: string;
  department: string;
  roomNumber: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number; // Acceptable radius in meters
  };
}

export interface Timetable {
  id: string;
  classId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
}

export interface AttendanceSession {
  id: string;
  classId: string;
  teacherId: string;
  date: string; // ISO date string
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  status: 'scheduled' | 'active' | 'completed';
  locationCheck: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
  proxyAttempt: boolean;
  timestamp: string; // ISO date string
  locationData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}
