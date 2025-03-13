
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  MapPin
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AttendanceSession } from '@/types';

const TeacherDashboard = () => {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  
  // Mock data
  const upcomingClasses = [
    {
      id: '1',
      classId: 'cs101',
      name: 'Introduction to Computer Science',
      startTime: '10:00',
      endTime: '11:30',
      roomNumber: 'A-101',
      studentsCount: 45
    },
    {
      id: '2',
      classId: 'cs202',
      name: 'Data Structures',
      startTime: '13:00',
      endTime: '14:30',
      roomNumber: 'B-203',
      studentsCount: 38
    },
    {
      id: '3',
      classId: 'cs303',
      name: 'Algorithms',
      startTime: '15:00',
      endTime: '16:30',
      roomNumber: 'C-105',
      studentsCount: 32
    },
  ];

  const attendanceSummary = [
    { class: 'CS101', total: 45, present: 40, absent: 5, proxyAlerts: 2 },
    { class: 'CS202', total: 38, present: 35, absent: 3, proxyAlerts: 0 },
    { class: 'CS303', total: 32, present: 30, absent: 2, proxyAlerts: 1 },
  ];

  const startAttendanceSession = (classItem: any) => {
    // In a real app, this would create a new attendance session in the database
    setActiveSession({
      id: `session-${Date.now()}`,
      classId: classItem.classId,
      teacherId: 'teacher-123',
      date: new Date().toISOString(),
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      status: 'active',
      locationCheck: true
    });

    toast({
      title: "Attendance Session Started",
      description: `Started for ${classItem.name}`,
    });
  };

  const endAttendanceSession = () => {
    if (activeSession) {
      // In a real app, this would update the attendance session in the database
      setActiveSession(null);
      
      toast({
        title: "Attendance Session Ended",
        description: "Attendance records have been saved.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classes and attendance sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Today: {new Date().toLocaleDateString()}</span>
          </Button>
        </div>
      </div>

      {activeSession && (
        <Card className="border-primary/50 bg-primary/5 animate-pulse-slow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Active Attendance Session
            </CardTitle>
            <CardDescription>
              Students can mark their attendance now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Class: CS101 - Introduction to Computer Science</p>
                <p className="text-sm text-muted-foreground">Room: A-101 • Started at: 10:00 AM</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Live</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Live Attendance</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Students Checked In: 32/45</div>
                        <div className="text-sm text-muted-foreground">Auto-close in: 01:24</div>
                      </div>

                      <div className="border rounded-md p-4 space-y-2 h-60 overflow-y-auto">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center py-1 border-b">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-green-500" />
                              <span>Student {i + 1}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(Date.now() - i * 5000).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-yellow-50 border-yellow-200 border rounded-md p-3">
                        <h4 className="font-medium flex items-center text-yellow-800 gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Proxy Attempts Detected (2)
                        </h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <div className="text-sm flex items-center gap-1 text-yellow-800">
                              <MapPin className="h-3 w-3" />
                              <span>Student 12 - Location outside class (240m away)</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm flex items-center gap-1 text-yellow-800">
                              <MapPin className="h-3 w-3" />
                              <span>Student 27 - Location outside campus</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="default" onClick={endAttendanceSession}>End Session</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Classes</CardTitle>
            <CardDescription>
              Your upcoming classes for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{classItem.name}</p>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {classItem.startTime} - {classItem.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classItem.roomNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {classItem.studentsCount} students
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          disabled={!!activeSession}
                          onClick={() => startAttendanceSession(classItem)}
                        >
                          Start
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {activeSession 
                          ? "You already have an active session" 
                          : "Start attendance session"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
            <CardDescription>Last 7 days attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceSummary.map((item) => (
                <div key={item.class} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.class}</span>
                    <span className="text-sm text-muted-foreground">{Math.round((item.present / item.total) * 100)}% Present</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(item.present / item.total) * 100}%` }} 
                    />
                  </div>
                  <div className="flex text-xs text-muted-foreground justify-between">
                    <span>Present: {item.present}/{item.total}</span>
                    <span>Absent: {item.absent}</span>
                    {item.proxyAlerts > 0 && (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {item.proxyAlerts} proxy alerts
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Full Timetable
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Classes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                View Attendance Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
