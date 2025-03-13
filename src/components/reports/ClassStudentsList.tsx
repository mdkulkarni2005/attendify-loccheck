
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classes: string[];
  attendance: number;
}

interface ClassStudentsListProps {
  students: Student[];
  classCode: string;
}

const ClassStudentsList = ({ students, classCode }: ClassStudentsListProps) => {
  // Filter students by this class
  const studentsInClass = students.filter(student => student.classes.includes(classCode));
  
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
        <div className="col-span-5">Name</div>
        <div className="col-span-3">Roll Number</div>
        <div className="col-span-2 text-center">Present</div>
        <div className="col-span-2 text-center">Attendance</div>
      </div>
      <div className="divide-y">
        {studentsInClass.map((student) => {
          const attendance = Math.floor(Math.random() * 30) + 65;
          const present = Math.floor(32 * (attendance / 100));
          
          return (
            <div 
              key={student.id} 
              className={`grid grid-cols-12 items-center p-3 text-sm ${
                attendance < 75 ? 'bg-red-50 dark:bg-red-900/20' : ''
              }`}
            >
              <div className="col-span-5 font-medium">
                {student.name}
                {attendance < 75 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-300">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Low
                  </span>
                )}
              </div>
              <div className="col-span-3 text-muted-foreground">{student.rollNumber}</div>
              <div className="col-span-2 text-center">{present}/32</div>
              <div className="col-span-2 text-center">
                <span className={`font-medium ${
                  attendance < 75 ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  {attendance}%
                </span>
              </div>
            </div>
          );
        })}
        {studentsInClass.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No students enrolled in this class
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassStudentsList;
