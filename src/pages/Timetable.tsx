import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Clock, MapPin, User, AlertTriangle, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { format, parseISO, addMinutes, isWithinInterval } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LocationCheck from '@/components/attendance/LocationCheck';

// Mock timetable data for demo
// In a real app, this would come from the API
const MOCK_TIMETABLE = [
  {
    id: 'class-1',
    courseCode: 'CS101',
    name: 'Introduction to Computer Science',
    dayOfWeek: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    room: 'A-101',
    teacher: 'Dr. Smith',
    department: 'Computer Science',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  },
  {
    id: 'class-2',
    courseCode: 'MATH101',
    name: 'Calculus I',
    dayOfWeek: 'Monday',
    startTime: '11:15',
    endTime: '12:15',
    room: 'B-203',
    teacher: 'Dr. Johnson',
    department: 'Mathematics',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  },
  {
    id: 'class-3',
    courseCode: 'PHY101',
    name: 'Physics I',
    dayOfWeek: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'C-105',
    teacher: 'Dr. Williams',
    department: 'Physics',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  },
  {
    id: 'class-4',
    courseCode: 'ENG101',
    name: 'English Composition',
    dayOfWeek: 'Wednesday',
    startTime: '13:00',
    endTime: '14:00',
    room: 'D-301',
    teacher: 'Prof. Brown',
    department: 'English',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  },
  {
    id: 'class-5',
    courseCode: 'CS202',
    name: 'Data Structures',
    dayOfWeek: 'Thursday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'A-102',
    teacher: 'Dr. Davis',
    department: 'Computer Science',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  },
  {
    id: 'class-6',
    courseCode: 'BUS101',
    name: 'Introduction to Business',
    dayOfWeek: 'Friday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'E-201',
    teacher: 'Prof. Miller',
    department: 'Business',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 50
    }
  }
];

// Mock attendance sessions
const MOCK_ACTIVE_SESSIONS = [
  {
    id: 'session-1',
    classId: 'class-1',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '11:00',
    status: 'active',
    teacherLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const { userRole, isTeacher, isStudent } = useAuth();
  const { toast } = useToast();
  const [activeDay, setActiveDay] = useState<string>(daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [timeTable, setTimeTable] = useState(MOCK_TIMETABLE);
  const [activeSessions, setActiveSessions] = useState(MOCK_ACTIVE_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  
  // Current time tracking for highlighting current classes
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const isCurrentClass = (startTime: string, endTime: string) => {
    if (activeDay !== daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]) {
      return false;
    }
    
    const now = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);
    
    return isWithinInterval(now, { start: startDate, end: endDate });
  };
  
  const getUpcomingClasses = () => {
    const today = daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return timeTable
      .filter(cls => cls.dayOfWeek === today)
      .filter(cls => {
        const [startHour, startMinute] = cls.startTime.split(':').map(Number);
        return (startHour > currentHour) || 
               (startHour === currentHour && startMinute > currentMinute);
      })
      .sort((a, b) => {
        const [aHour, aMinute] = a.startTime.split(':').map(Number);
        const [bHour, bMinute] = b.startTime.split(':').map(Number);
        
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
      })
      .slice(0, 3);
  };
  
  const getActiveSession = (classId: string) => {
    return activeSessions.find(
      session => session.classId === classId && session.status === 'active'
    );
  };
  
  const handleMarkAttendance = (classId: string) => {
    const session = getActiveSession(classId);
    if (session) {
      setSelectedSessionId(session.id);
      setShowAttendanceDialog(true);
    } else {
      toast({
        title: "No active session",
        description: "There is no active attendance session for this class.",
        variant: "destructive"
      });
    }
  };
  
  const handleLocationVerified = (isValid: boolean, distance?: number, locationData?: any) => {
    if (isValid) {
      // In a real app, this would call an API to mark attendance
      toast({
        title: "Attendance Marked",
        description: "You have been marked present for this class."
      });
      
      // Close dialog
      setShowAttendanceDialog(false);
      setSelectedSessionId(null);
      
      // Simulate API call to backend
      console.log("Marking attendance with:", {
        sessionId: selectedSessionId,
        studentId: "current-user-id",
        status: "present",
        locationData
      });
    } else if (distance && distance <= 100) {
      toast({
        variant: "destructive",
        title: "Proxy Attendance Detected",
        description: "Your attendance has been flagged for review."
      });
      
      // Close dialog
      setShowAttendanceDialog(false);
      setSelectedSessionId(null);
      
      // Simulate API call to backend
      console.log("Marking attendance with:", {
        sessionId: selectedSessionId,
        studentId: "current-user-id",
        status: "proxy",
        locationData
      });
    } else {
      toast({
        variant: "destructive",
        title: "Location Verification Failed",
        description: "You are too far from the classroom. Attendance not marked."
      });
    }
  };
  
  const handleStartSession = (classId: string) => {
    // In a real app, this would call an API to start a session
    // Mock the behavior for now
    
    // Check if session already exists
    if (getActiveSession(classId)) {
      toast({
        title: "Session Already Active",
        description: "There is already an active session for this class."
      });
      return;
    }
    
    // Start a new session
    const classInfo = timeTable.find(cls => cls.id === classId);
    if (!classInfo) return;
    
    const now = new Date();
    const newSession = {
      id: `session-${Date.now()}`,
      classId,
      date: now.toISOString(),
      startTime: classInfo.startTime,
      endTime: classInfo.endTime,
      status: 'active' as const,
      teacherLocation: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    };
    
    setActiveSessions([...activeSessions, newSession]);
    
    // Set auto-close timer
    const [endHour, endMinute] = classInfo.endTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);
    
    toast({
      title: "Attendance Session Started",
      description: `Students can now mark attendance for ${classInfo.name}`
    });
    
    // Send notification to students' phones
    toast({
      title: "Notifications Sent",
      description: "All students have been notified about the attendance session."
    });
    
    // Auto-close the session at the end time
    const timeUntilEnd = endTime.getTime() - now.getTime();
    if (timeUntilEnd > 0) {
      setTimeout(() => {
        // Complete the session
        setActiveSessions(prev => 
          prev.map(s => s.id === newSession.id ? { ...s, status: 'completed' } : s)
        );
        
        toast({
          title: "Session Ended",
          description: `Attendance session for ${classInfo.name} has ended automatically.`
        });
      }, timeUntilEnd);
    }
  };
  
  const handleEndSession = (classId: string) => {
    const session = getActiveSession(classId);
    if (!session) return;
    
    // Mark session as completed
    setActiveSessions(prev => 
      prev.map(s => s.id === session.id ? { ...s, status: 'completed' } : s)
    );
    
    const classInfo = timeTable.find(cls => cls.id === classId);
    
    toast({
      title: "Session Ended",
      description: `Attendance session for ${classInfo?.name} has been ended.`
    });
  };
  
  const getDailySchedule = (day: string) => {
    return timeTable
      .filter(cls => cls.dayOfWeek === day)
      .sort((a, b) => {
        const [aHour, aMinute] = a.startTime.split(':').map(Number);
        const [bHour, bMinute] = b.startTime.split(':').map(Number);
        
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
      });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Timetable</h1>
            <p className="text-muted-foreground">
              View your weekly schedule and manage attendance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hidden sm:flex items-center gap-2" onClick={() => setActiveDay(daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])}>
              <Calendar className="h-4 w-4" />
              Today
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Click on a day to view your classes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6">
                  {daysOfWeek.map((day) => (
                    <TabsTrigger 
                      key={day} 
                      value={day}
                      onClick={() => setActiveDay(day)}
                      className={activeDay === day ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                    >
                      {day.substring(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="space-y-2">
                  <h3 className="font-medium">{activeDay} Classes</h3>
                  
                  {getDailySchedule(activeDay).length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">
                      No classes scheduled for {activeDay}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {getDailySchedule(activeDay).map((cls) => {
                        const isActive = isCurrentClass(cls.startTime, cls.endTime);
                        const hasActiveSession = !!getActiveSession(cls.id);
                        
                        return (
                          <Card 
                            key={cls.id} 
                            className={`border ${isActive ? 'border-primary border-2' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{cls.name}</h4>
                                    {isActive && (
                                      <Badge className="bg-primary text-xs">Now</Badge>
                                    )}
                                  </div>
                                  <Badge variant="outline">{cls.courseCode}</Badge>
                                  <div className="text-sm flex gap-4 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{cls.startTime} - {cls.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{cls.room}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{cls.teacher}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Show attendance buttons based on role and active status */}
                                <div className="flex gap-2 sm:self-end">
                                  {isTeacher && isActive && (
                                    hasActiveSession ? (
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => handleEndSession(cls.id)}
                                      >
                                        End Session
                                      </Button>
                                    ) : (
                                      <Button 
                                        onClick={() => handleStartSession(cls.id)}
                                      >
                                        Start Attendance
                                      </Button>
                                    )
                                  )}
                                  
                                  {isStudent && hasActiveSession && (
                                    <Button 
                                      onClick={() => handleMarkAttendance(cls.id)}
                                    >
                                      <CheckSquare className="mr-2 h-4 w-4" />
                                      Mark Attendance
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                {getUpcomingClasses().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No more classes today
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getUpcomingClasses().map((cls) => (
                      <div key={cls.id} className="flex items-center gap-3 p-2 rounded-md border">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm truncate">{cls.name}</h4>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{cls.startTime} - {cls.endTime}</span>
                            <span className="text-muted-foreground">{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t py-3 px-6">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Attendance Verification Dialog */}
        <Dialog 
          open={showAttendanceDialog} 
          onOpenChange={setShowAttendanceDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
            </DialogHeader>
            {selectedSessionId && (
              <LocationCheck 
                onLocationVerified={handleLocationVerified}
                classLocation={{
                  latitude: 37.7749,
                  longitude: -122.4194,
                  radius: 50
                }}
                teacherLocation={
                  activeSessions.find(s => s.id === selectedSessionId)?.teacherLocation
                }
                tolerance={15}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Timetable;