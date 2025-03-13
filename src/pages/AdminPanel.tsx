
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/UserManagement';
import TimetableManagement from '@/components/admin/TimetableManagement';
import { useAuth } from '@/hooks/use-auth';
import { Shield } from 'lucide-react';

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

        <Tabs defaultValue="users" className="w-full">
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
