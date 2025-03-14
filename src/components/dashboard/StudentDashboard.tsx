
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  XSquare,
  MapPin,
  AlertTriangle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StudentDashboard = () => {
  const { toast } = useToast();
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);

  // Mock data
  const todayClasses = [
    {
      id: '1',
      name: 'Introduction to Computer Science',
      courseCode: 'CS101',
      startTime: '10:00',
      endTime: '11:30',
      roomNumber: 'A-101',
      status: 'active',
      teacherName: 'Dr. Smith'
    },
    {
      id: '2',
      name: 'Data Structures',
      courseCode: 'CS202',
      startTime: '13:00',
      endTime: '14:30',
      roomNumber: 'B-203',
      status: 'upcoming',
      teacherName: 'Prof. Johnson'
    },
    {
      id: '3',
      name: 'Algorithms',
      courseCode: 'CS303',
      startTime: '15:00',
      endTime: '16:30',
      roomNumber: 'C-105',
      status: 'upcoming',
      teacherName: 'Dr. Williams'
    },
  ];

  const attendanceSummary = [
    { class: 'CS101', present: 12, total: 15, percentage: 80 },
    { class: 'CS202', present: 14, total: 15, percentage: 93 },
    { class: 'CS303', present: 13, total: 15, percentage: 87 },
  ];

  const markAttendance = () => {
    setIsCheckingLocation(true);

    // Simulate location check
    setTimeout(() => {
      setIsCheckingLocation(false);
      setHasMarkedAttendance(true);
      
      // Simulate successful attendance
      toast({
        title: "Attendance Marked",
        description: "You've been marked present for CS101",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            View your classes and attendance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/timetable">
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>View Timetable</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Today's Classes</CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </div>
            <Link to="/timetable">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                View Full Schedule
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div 
                  key={classItem.id} 
                  className={`border rounded-lg p-4 ${
                    classItem.status === 'active' 
                      ? 'border-primary bg-primary/5 animate-pulse-slow' 
                      : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{classItem.courseCode}: {classItem.name}</h3>
                        {classItem.status === 'active' && (
                          <Badge className="bg-green-500 hover:bg-green-600">Active Now</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {classItem.roomNumber}
                        </span>
                      </div>
                      <p className="text-sm mt-1">Teacher: {classItem.teacherName}</p>
                    </div>
                    
                    {classItem.status === 'active' && !hasMarkedAttendance && (
                      <Button 
                        className="w-full sm:w-auto"
                        onClick={markAttendance}
                        disabled={isCheckingLocation}
                      >
                        {isCheckingLocation ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking Location...
                          </>
                        ) : (
                          <>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Mark Attendance
                          </>
                        )}
                      </Button>
                    )}
                    
                    {classItem.status === 'active' && hasMarkedAttendance && (
                      <Badge className="bg-green-500 hover:bg-green-600 h-9 px-4 flex items-center">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Marked Present
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Summary</CardTitle>
            <CardDescription>Your attendance percentages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceSummary.map((item) => (
                <div key={item.class} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.class}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Present: {item.present}/{item.total} classes
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Overall Attendance:</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="text-xs text-muted-foreground">
                39/45 classes attended
              </div>
              
              {87 < 75 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attendance Warning</AlertTitle>
                  <AlertDescription>
                    Your attendance is below the required 75%
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
