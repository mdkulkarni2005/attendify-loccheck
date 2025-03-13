
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, BookOpen, FileText, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useAuth();

  return (
    <MainLayout>
      {userRole === 'teacher' ? (
        <TeacherDashboard />
      ) : userRole === 'student' ? (
        <StudentDashboard />
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all aspects of the attendance system.
            </p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">434</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">4 still pending</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.5%</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Access Cards */}
          <h2 className="text-xl font-semibold pt-4">Quick Access</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage teachers, students, and admin accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">358 Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">12 Inactive Users</span>
                  </div>
                </div>
                <Link to="/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Class Management
                </CardTitle>
                <CardDescription>
                  Configure classes, courses, and schedules.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="mb-4 text-sm text-muted-foreground">
                  Manage 24 active classes across 6 departments
                </p>
                <Link to="/classes">
                  <Button className="w-full">Manage Classes</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  System Reports
                </CardTitle>
                <CardDescription>
                  View comprehensive attendance analytics.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-[100px] flex items-center justify-center mb-4">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <Link to="/reports">
                  <Button className="w-full">View Reports</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <h2 className="text-xl font-semibold pt-4">Recent Activity</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {[
                  { text: "John Doe marked 25 students present in CS101", time: "10 minutes ago" },
                  { text: "Jane Smith created a new class: Mathematics 202", time: "2 hours ago" },
                  { text: "New teacher account created: Robert Johnson", time: "1 day ago" },
                  { text: "Attendance report generated for Computer Science department", time: "1 day ago" }
                ].map((activity, i) => (
                  <li key={i} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{activity.text}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
