
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, User, Calendar, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reports = () => {
  // Dummy data for the charts
  const attendanceData = [
    { name: 'Week 1', present: 85, absent: 15 },
    { name: 'Week 2', present: 80, absent: 20 },
    { name: 'Week 3', present: 90, absent: 10 },
    { name: 'Week 4', present: 75, absent: 25 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Reports
            </h1>
            <p className="text-muted-foreground">
              Generate and view attendance reports
            </p>
          </div>
          <Button>
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
                  
                  <div className="h-[300px] w-full flex items-center justify-center border rounded-md">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Attendance Chart</span>
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student1">John Doe</SelectItem>
                      <SelectItem value="student2">Jane Smith</SelectItem>
                      <SelectItem value="student3">Robert Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="text-center text-muted-foreground py-8">
                    <User className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p>Select a student to view their attendance report</p>
                  </div>
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class1">Computer Science 101</SelectItem>
                      <SelectItem value="class2">Mathematics 202</SelectItem>
                      <SelectItem value="class3">Physics 303</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p>Select a class to view its attendance report</p>
                  </div>
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
