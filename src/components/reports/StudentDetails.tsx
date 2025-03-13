
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface StudentDetailsProps {
  student: {
    id: string;
    name: string;
    rollNumber: string;
    classes: string[];
    attendance: number;
  };
  classData: {
    id: string;
    name: string;
    code: string;
    avgAttendance: number;
  }[];
  onGenerateReport: () => void;
}

const StudentDetails = ({ student, classData, onGenerateReport }: StudentDetailsProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-semibold">{student.name}</h3>
              <p className="text-muted-foreground">Roll Number: {student.rollNumber}</p>
              <p className="text-muted-foreground">Classes: {student.classes.join(', ')}</p>
            </div>
            <div className={`text-right mt-4 md:mt-0 ${
              student.attendance < 75 ? 'text-red-600' : 'text-green-600'
            }`}>
              <div className="text-3xl font-bold">{student.attendance}%</div>
              <p>Overall Attendance</p>
              {student.attendance < 75 && (
                <p className="flex items-center justify-end gap-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  Below threshold
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {student.classes.map(cls => {
          const classInfo = classData.find(c => c.code === cls);
          return (
            <Card key={cls}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{classInfo?.name || cls}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {Math.floor(Math.random() * 30) + 70}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Attended 28 out of 32 classes
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Button onClick={onGenerateReport} className="w-full">
        <Download className="mr-2 h-4 w-4" /> Download Detailed Report
      </Button>
    </div>
  );
};

export default StudentDetails;
