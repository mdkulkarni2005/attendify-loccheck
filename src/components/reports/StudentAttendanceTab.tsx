
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import StudentDetails from './StudentDetails';

interface StudentAttendanceTabProps {
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  studentData: {
    id: string;
    name: string;
    rollNumber: string;
    classes: string[];
    attendance: number;
  }[];
  classData: {
    id: string;
    name: string;
    code: string;
    avgAttendance: number;
  }[];
  onGenerateReport: () => void;
}

const StudentAttendanceTab = ({
  selectedStudent,
  setSelectedStudent,
  studentData,
  classData,
  onGenerateReport
}: StudentAttendanceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance Report</CardTitle>
        <CardDescription>View attendance for individual students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {studentData.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedStudent ? (
            (() => {
              const student = studentData.find(s => s.id === selectedStudent);
              if (!student) return null;
              
              return (
                <StudentDetails 
                  student={student} 
                  classData={classData} 
                  onGenerateReport={onGenerateReport} 
                />
              );
            })()
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <User className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
              <p>Select a student to view their attendance report</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceTab;
