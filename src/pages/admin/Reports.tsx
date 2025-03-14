
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import OverallAttendanceTab from '@/components/reports/OverallAttendanceTab';
import StudentAttendanceTab from '@/components/reports/StudentAttendanceTab';
import ClassAttendanceTab from '@/components/reports/ClassAttendanceTab';
import AttendanceReport from '@/components/reports/AttendanceReport';

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  // Dummy data for the charts
  const attendanceData = [
    { name: 'Week 1', present: 85, absent: 15 },
    { name: 'Week 2', present: 80, absent: 20 },
    { name: 'Week 3', present: 90, absent: 10 },
    { name: 'Week 4', present: 75, absent: 25 },
  ];

  // Dummy student data for reports
  const studentData = [
    { id: 'student1', name: 'John Doe', rollNumber: 'S001', classes: ['CS101', 'MATH202'], attendance: 92 },
    { id: 'student2', name: 'Jane Smith', rollNumber: 'S002', classes: ['CS101', 'PHYS303'], attendance: 85 },
    { id: 'student3', name: 'Robert Johnson', rollNumber: 'S003', classes: ['MATH202', 'CHEM404'], attendance: 65 },
    { id: 'student4', name: 'Emily Wilson', rollNumber: 'S004', classes: ['CS101', 'PHYS303'], attendance: 78 },
    { id: 'student5', name: 'Michael Brown', rollNumber: 'S005', classes: ['MATH202', 'CHEM404'], attendance: 73 },
  ];

  // Dummy class data
  const classData = [
    { id: 'class1', name: 'Computer Science 101', code: 'CS101', avgAttendance: 88 },
    { id: 'class2', name: 'Mathematics 202', code: 'MATH202', avgAttendance: 76 },
    { id: 'class3', name: 'Physics 303', code: 'PHYS303', avgAttendance: 82 },
    { id: 'class4', name: 'Chemistry 404', code: 'CHEM404', avgAttendance: 79 },
  ];

  const handleGenerateReport = () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    // Show toast notification
    toast({
      title: "Report Generated",
      description: "Attendance report has been generated and is ready for download",
    });
    
    // Show toast notification for email
    toast({
      title: "Report Sent",
      description: `The report has been sent to ${userEmail || 'your registered email'}`,
    });
  };

  const handleExportReport = () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    toast({
      title: "Report Exported",
      description: "Attendance report has been exported successfully",
    });
    
    toast({
      title: "Report Sent",
      description: `The report has been sent to ${userEmail || 'your registered email'}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Reports
            </h1>
            <p className="text-muted-foreground">
              Generate and view attendance reports
            </p>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" /> Export Reports
          </Button>
        </div>
        
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="students">Student</TabsTrigger>
            <TabsTrigger value="classes">Class</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-4 mt-6">
            <OverallAttendanceTab 
              attendanceData={attendanceData}
              studentData={studentData}
              onExportReport={handleExportReport}
            />
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4 mt-6">
            <StudentAttendanceTab
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              studentData={studentData}
              classData={classData}
              onGenerateReport={handleGenerateReport}
            />
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4 mt-6">
            <ClassAttendanceTab
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              classData={classData}
              studentData={studentData}
              onGenerateReport={handleGenerateReport}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-6">
            <AttendanceReport />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
