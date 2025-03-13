
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ClassStudentsList from './ClassStudentsList';

interface ClassDetailsProps {
  classInfo: {
    id: string;
    name: string;
    code: string;
    avgAttendance: number;
  };
  studentData: {
    id: string;
    name: string;
    rollNumber: string;
    classes: string[];
    attendance: number;
  }[];
  onGenerateReport: () => void;
}

const ClassDetails = ({ classInfo, studentData, onGenerateReport }: ClassDetailsProps) => {
  const studentsInClass = studentData.filter(
    student => student.classes.includes(classInfo.code)
  );
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-semibold">{classInfo.name}</h3>
              <p className="text-muted-foreground">Course Code: {classInfo.code}</p>
              <p className="text-muted-foreground">
                {studentsInClass.length} Students Enrolled
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0 text-blue-600">
              <div className="text-3xl font-bold">{classInfo.avgAttendance}%</div>
              <p>Average Attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ClassStudentsList students={studentData} classCode={classInfo.code} />
      
      <Button onClick={onGenerateReport} className="w-full">
        <Download className="mr-2 h-4 w-4" /> Download Class Report
      </Button>
    </div>
  );
};

export default ClassDetails;
