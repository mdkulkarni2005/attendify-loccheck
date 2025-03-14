
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, CheckSquare, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AttendanceSession from '@/components/attendance/AttendanceSession';
import { AttendanceSession as AttendanceSessionType } from '@/types';

const Attendance = () => {
  // In a real app, this would come from authentication
  const [userRole] = useState<'teacher' | 'student'>('teacher');
  
  // Mock active session data
  const [activeSession] = useState<AttendanceSessionType>({
    id: 'session-1',
    classId: 'cs101',
    teacherId: 'teacher-123',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '11:30',
    status: 'active',
    locationCheck: true
  });

  // Mock attendance record data
  const attendanceRecords = [
    {
      date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
      class: 'CS101 - Introduction to Computer Science',
      present: 42,
      absent: 3,
      total: 45,
      percentage: 93.3
    },
    {
      date: new Date(Date.now() - 2 * 86400000).toLocaleDateString(), // 2 days ago
      class: 'CS101 - Introduction to Computer Science',
      present: 40,
      absent: 5,
      total: 45,
      percentage: 88.9
    },
    {
      date: new Date(Date.now() - 3 * 86400000).toLocaleDateString(), // 3 days ago
      class: 'CS101 - Introduction to Computer Science',
      present: 43,
      absent: 2,
      total: 45,
      percentage: 95.6
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">
              {userRole === 'teacher' 
                ? 'Manage attendance sessions and records'
                : 'View your attendance records'}
            </p>
          </div>
          {userRole === 'teacher' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Records
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <AttendanceSession 
              session={activeSession} 
              isTeacher={userRole === 'teacher'}
              onEndSession={() => {
                console.log("End session");
                // Update the session status to completed
                activeSession.status = 'completed';
                // Show visual feedback
                alert("Session ended successfully");
              }}
            />
          </div>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                View and manage attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="history">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search records..." 
                        className="pl-9 w-[200px]" 
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="cs101">CS101</SelectItem>
                        <SelectItem value="cs202">CS202</SelectItem>
                        <SelectItem value="cs303">CS303</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <TabsContent value="history">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 font-medium text-sm p-3 border-b bg-muted/50">
                      <div>Date</div>
                      <div className="col-span-2">Class</div>
                      <div>Attendance</div>
                      <div>Actions</div>
                    </div>
                    
                    <div className="divide-y">
                      {attendanceRecords.map((record, i) => (
                        <div key={i} className="grid grid-cols-5 p-3 items-center">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{record.date}</span>
                          </div>
                          <div className="col-span-2">{record.class}</div>
                          <div>
                            <div className="flex items-center gap-1">
                              <CheckSquare className="h-4 w-4 text-green-500" />
                              <span>
                                {record.present}/{record.total} ({record.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="border rounded-md p-6 text-center">
                    <p className="text-muted-foreground">
                      Attendance analytics will be available here in a future update.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;
