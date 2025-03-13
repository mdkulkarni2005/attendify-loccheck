
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, User, Calendar, BarChart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const { toast } = useToast();
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
    toast({
      title: "Report Generated",
      description: "Attendance report has been generated and is ready for download",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Attendance report has been exported successfully",
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
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="students">Student</TabsTrigger>
            <TabsTrigger value="classes">Class</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Attendance Report</CardTitle>
                <CardDescription>View attendance statistics for all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">82.5%</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Present Students</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">358</div>
                        <p className="text-xs text-muted-foreground">Out of 434 total students</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Absent Students</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">76</div>
                        <p className="text-xs text-muted-foreground">17.5% of total students</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="h-[300px] w-full border rounded-md p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsBarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#8884d8" name="Present" />
                        <Bar dataKey="absent" fill="#82ca9d" name="Absent" />
                      </ReChartsBarChart>
                    </ResponsiveContainer>
                  </div>

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
                        {studentData
                          .filter(student => student.attendance < 75)
                          .map((student) => (
                          <div 
                            key={student.id} 
                            className="grid grid-cols-12 items-center p-3 text-sm bg-red-50 dark:bg-red-900/20"
                          >
                            <div className="col-span-4 font-medium flex items-center">
                              {student.attendance < 75 && (
                                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                              )}
                              {student.name}
                            </div>
                            <div className="col-span-3 text-muted-foreground">{student.rollNumber}</div>
                            <div className="col-span-3">{student.classes.join(', ')}</div>
                            <div className="col-span-2">
                              <span className={`font-medium ${
                                student.attendance < 75 ? 'text-red-600 dark:text-red-400' : ''
                              }`}>
                                {student.attendance}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4 mt-6">
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
                    <div className="space-y-4">
                      {(() => {
                        const student = studentData.find(s => s.id === selectedStudent);
                        if (!student) return null;
                        
                        return (
                          <>
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
                            
                            <Button onClick={handleGenerateReport} className="w-full">
                              <Download className="mr-2 h-4 w-4" /> Download Detailed Report
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <User className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                      <p>Select a student to view their attendance report</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4 mt-6">
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
                    <div className="space-y-4">
                      {(() => {
                        const classInfo = classData.find(c => c.id === selectedClass);
                        if (!classInfo) return null;
                        
                        const studentsInClass = studentData.filter(
                          student => student.classes.includes(classInfo.code)
                        );
                        
                        return (
                          <>
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
                              </div>
                            </div>
                            
                            <Button onClick={handleGenerateReport} className="w-full">
                              <Download className="mr-2 h-4 w-4" /> Download Class Report
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Calendar className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                      <p>Select a class to view its attendance report</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
