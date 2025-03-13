
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import AttendanceOverviewCards from './AttendanceOverviewCards';
import AttendanceChart from './AttendanceChart';
import LowAttendanceStudents from './LowAttendanceStudents';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classes: string[];
  attendance: number;
}

interface OverallAttendanceTabProps {
  attendanceData: {
    name: string;
    present: number;
    absent: number;
  }[];
  studentData: Student[];
  onExportReport: () => void;
}

const OverallAttendanceTab = ({ 
  attendanceData, 
  studentData,
  onExportReport
}: OverallAttendanceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Attendance Report</CardTitle>
        <CardDescription>View attendance statistics for all classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AttendanceOverviewCards 
            averageAttendance={82.5} 
            presentStudents={358} 
            totalStudents={434} 
            absentStudents={76} 
          />
          
          <AttendanceChart data={attendanceData} />

          <LowAttendanceStudents students={studentData} />
          
          <Button onClick={onExportReport} className="w-full mt-4">
            <Download className="mr-2 h-4 w-4" /> Download Overall Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallAttendanceTab;
