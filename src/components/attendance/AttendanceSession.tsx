
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckSquare, Clock, MapPin, User, Users, XSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationCheck from './LocationCheck';
import { AttendanceSession as AttendanceSessionType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AttendanceSessionProps {
  session: AttendanceSessionType;
  isTeacher: boolean;
  onEndSession?: () => void;
}

const AttendanceSession: React.FC<AttendanceSessionProps> = ({
  session,
  isTeacher,
  onEndSession
}) => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [attendanceStatus, setAttendanceStatus] = useState<'pending' | 'present' | 'absent' | 'proxy'>('pending');
  const [studentsPresent, setStudentsPresent] = useState(0);
  const [totalStudents, setTotalStudents] = useState(45);
  const [showLocationCheck, setShowLocationCheck] = useState(false);

  // Mock student list
  const studentList = Array.from({ length: totalStudents }).map((_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    rollNumber: `S00${i + 1}`,
    status: i < studentsPresent ? 'present' : 'absent',
    proxyAttempt: i === 5 || i === 20, // Mark a couple of students as proxy attempts
    timestamp: new Date(Date.now() - i * 5000).toISOString()
  }));

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Function to handle sending emails (mock)
  const sendAttendanceEmail = () => {
    return new Promise<void>((resolve) => {
      // In a real app, this would connect to an email service
      console.log("Sending email notification about attendance");
      setTimeout(() => {
        console.log("Email sent successfully");
        resolve();
      }, 1000);
    });
  };

  // Simulate timer countdown
  useEffect(() => {
    if (timeLeft > 0 && session.status === 'active') {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && attendanceStatus === 'pending') {
      // Auto mark as absent if time runs out
      setAttendanceStatus('absent');
    }
  }, [timeLeft, session.status, attendanceStatus]);

  // Simulate students marking attendance
  useEffect(() => {
    if (session.status === 'active' && isTeacher) {
      const interval = setInterval(() => {
        if (studentsPresent < totalStudents - 5) { // Leave a few absent
          setStudentsPresent(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [session.status, isTeacher, studentsPresent, totalStudents]);

  const handleMarkAttendance = () => {
    setShowLocationCheck(true);
  };

  const handleLocationVerified = async (isValid: boolean, distance?: number, locationData?: any) => {
    if (isValid) {
      setAttendanceStatus('present');
      // Send email notification when attendance is marked
      await sendAttendanceEmail();
      toast({
        title: "Attendance Email Sent",
        description: "A confirmation email has been sent to your registered email address.",
      });
      
      // In a real app, this would save to MongoDB via API
      console.log("Making API call to mark attendance as present:", {
        sessionId: session.id,
        status: 'present',
        locationData
      });
    } else if (distance && distance <= 100) {
      setAttendanceStatus('proxy');
      
      // In a real app, this would save to MongoDB via API
      console.log("Making API call to mark attendance as proxy:", {
        sessionId: session.id,
        status: 'proxy',
        locationData
      });
    } else {
      setAttendanceStatus('absent');
      
      // In a real app, this would save to MongoDB via API
      console.log("Making API call to mark attendance as absent:", {
        sessionId: session.id,
        status: 'absent',
        locationData
      });
    }
    setShowLocationCheck(false);
  };

  return (
    <Card className={session.status === 'active' ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Attendance Session</CardTitle>
            <CardDescription>
              {session.status === 'scheduled' ? 'Upcoming session' : 
               session.status === 'active' ? 'Active now' : 'Completed session'}
            </CardDescription>
          </div>
          <Badge
            className={
              session.status === 'scheduled' ? 'bg-muted text-muted-foreground' : 
              session.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
              'bg-blue-500 hover:bg-blue-600'
            }
          >
            {session.status === 'scheduled' ? 'Scheduled' : 
             session.status === 'active' ? 'Active' : 'Completed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Class</span>
            <p className="font-medium">CS101 - Introduction to Computer Science</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Date</span>
            <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Time</span>
            <p className="font-medium">{session.startTime} - {session.endTime}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Location</span>
            <p className="font-medium">Room A-101</p>
          </div>
        </div>

        {session.status === 'active' && !isTeacher && (
          <div className="space-y-2 py-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Time Remaining</span>
              <span className={`font-mono ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Progress value={(timeLeft / 180) * 100} className="h-2" />
            
            {attendanceStatus === 'pending' && (
              <Button 
                className="w-full mt-4" 
                onClick={handleMarkAttendance}
                disabled={timeLeft === 0}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            )}
            
            {attendanceStatus === 'present' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4 text-green-800 flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
                You have been marked present
              </div>
            )}
            
            {attendanceStatus === 'absent' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4 text-red-800 flex items-center">
                <XSquare className="mr-2 h-5 w-5 text-red-500" />
                You have been marked absent
              </div>
            )}
            
            {attendanceStatus === 'proxy' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4 text-yellow-800">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  Proxy attendance attempt detected
                </div>
                <p className="text-sm mt-1">
                  Your location indicates you are not in the classroom.
                  This has been flagged for the teacher's review.
                </p>
              </div>
            )}
          </div>
        )}

        {session.status === 'active' && isTeacher && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Student Check-ins</span>
                <span className="text-sm text-muted-foreground">
                  {studentsPresent}/{totalStudents} students
                </span>
              </div>
              <Progress value={(studentsPresent / totalStudents) * 100} className="h-2" />
              
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Session will auto-close in {formatTime(timeLeft)}</span>
                <span>{Math.round((studentsPresent / totalStudents) * 100)}% present</span>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  View Student Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Student Attendance Details</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All Students</TabsTrigger>
                    <TabsTrigger value="present">Present ({studentsPresent})</TabsTrigger>
                    <TabsTrigger value="absent">Absent ({totalStudents - studentsPresent})</TabsTrigger>
                    <TabsTrigger value="proxy">Proxy Alerts (2)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="h-96 overflow-auto">
                    <div className="border rounded-md divide-y">
                      {studentList.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.status === 'present' ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-500">Absent</Badge>
                            )}
                            {student.proxyAttempt && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Proxy Alert
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="present" className="h-96 overflow-auto">
                    <div className="border rounded-md divide-y">
                      {studentList.filter(s => s.status === 'present').map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
                            {student.proxyAttempt && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Proxy Alert
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(student.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="absent" className="h-96 overflow-auto">
                    <div className="border rounded-md divide-y">
                      {studentList.filter(s => s.status === 'absent').map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-red-500">Absent</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="proxy" className="h-96 overflow-auto">
                    <div className="border rounded-md divide-y">
                      {studentList.filter(s => s.proxyAttempt).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Proxy Alert
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onEndSession}
            >
              <Clock className="mr-2 h-4 w-4" />
              End Session Early
            </Button>
          </div>
        )}

        {showLocationCheck && (
          <Dialog open={showLocationCheck} onOpenChange={setShowLocationCheck}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Location Verification</DialogTitle>
              </DialogHeader>
              <LocationCheck 
                onLocationVerified={handleLocationVerified}
                classLocation={{
                  latitude: 37.7749, // Example coordinates
                  longitude: -122.4194,
                  radius: 50 // 50 meters radius
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceSession;
