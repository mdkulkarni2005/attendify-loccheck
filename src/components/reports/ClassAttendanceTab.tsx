
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import ClassDetails from './ClassDetails';

interface ClassAttendanceTabProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  classData: {
    id: string;
    name: string;
    code: string;
    avgAttendance: number;
  }[];
  studentData: {
    id: string;
    name: string;
    rollNumber: string;
    classes: string[];
    attendance: number;
  }[];
  onGenerateReport: () => void;
}

const ClassAttendanceTab = ({
  selectedClass,
  setSelectedClass,
  classData,
  studentData,
  onGenerateReport
}: ClassAttendanceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Attendance Report</CardTitle>
        <CardDescription>View attendance for specific classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classData.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedClass ? (
            (() => {
              const classInfo = classData.find(c => c.id === selectedClass);
              if (!classInfo) return null;
              
              return (
                <ClassDetails 
                  classInfo={classInfo} 
                  studentData={studentData} 
                  onGenerateReport={onGenerateReport} 
                />
              );
            })()
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
              <p>Select a class to view its attendance report</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassAttendanceTab;
