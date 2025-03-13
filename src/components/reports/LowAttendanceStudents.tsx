
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classes: string[];
  attendance: number;
}

interface LowAttendanceStudentsProps {
  students: Student[];
  attendanceThreshold?: number;
}

const LowAttendanceStudents = ({ 
  students, 
  attendanceThreshold = 75 
}: LowAttendanceStudentsProps) => {
  const lowAttendanceStudents = students.filter(student => student.attendance < attendanceThreshold);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Students with Low Attendance</h3>
      <div className="rounded-md border">
        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Roll Number</div>
          <div className="col-span-3">Classes</div>
          <div className="col-span-2">Attendance</div>
        </div>
        <div className="divide-y">
          {lowAttendanceStudents.map((student) => (
            <div 
              key={student.id} 
              className="grid grid-cols-12 items-center p-3 text-sm bg-red-50 dark:bg-red-900/20"
            >
              <div className="col-span-4 font-medium flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                {student.name}
              </div>
              <div className="col-span-3 text-muted-foreground">{student.rollNumber}</div>
              <div className="col-span-3">{student.classes.join(', ')}</div>
              <div className="col-span-2">
                <span className="font-medium text-red-600 dark:text-red-400">
                  {student.attendance}%
                </span>
              </div>
            </div>
          ))}
          {lowAttendanceStudents.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No students with attendance below {attendanceThreshold}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowAttendanceStudents;
