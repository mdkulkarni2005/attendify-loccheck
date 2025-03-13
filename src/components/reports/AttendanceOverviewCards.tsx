
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceStatsProps {
  averageAttendance: number;
  presentStudents: number;
  totalStudents: number;
  absentStudents: number;
}

const AttendanceOverviewCards = ({
  averageAttendance,
  presentStudents,
  totalStudents,
  absentStudents
}: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttendance}%</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Present Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{presentStudents}</div>
          <p className="text-xs text-muted-foreground">Out of {totalStudents} total students</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Absent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{absentStudents}</div>
          <p className="text-xs text-muted-foreground">{(absentStudents / totalStudents * 100).toFixed(1)}% of total students</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceOverviewCards;
