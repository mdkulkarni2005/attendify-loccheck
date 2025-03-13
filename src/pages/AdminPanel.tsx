
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/UserManagement';
import TimetableManagement from '@/components/admin/TimetableManagement';
import { useAuth } from '@/hooks/use-auth';
import { Shield, Users, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { isAdmin } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and timetables
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or remove users from the system. Assign roles and permissions.
              </p>
              <Link to="/users">
                <Button className="w-full">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Class Management
              </CardTitle>
              <CardDescription>
                Manage classes and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and organize classes, assign teachers, and manage course codes.
              </p>
              <Link to="/classes">
                <Button className="w-full">Manage Classes</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reports
              </CardTitle>
              <CardDescription>
                View attendance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access detailed attendance reports, export data, and analyze trends.
              </p>
              <Link to="/reports">
                <Button className="w-full">View Reports</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="timetable">Timetable Management</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4 mt-6">
            <UserManagement />
          </TabsContent>
          <TabsContent value="timetable" className="space-y-4 mt-6">
            <TimetableManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
