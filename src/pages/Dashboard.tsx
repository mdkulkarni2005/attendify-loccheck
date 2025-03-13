
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { useAuth } from '@/hooks/use-auth';

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-2">User Management</h2>
              <p className="text-muted-foreground">
                Manage teachers, students, and admin accounts.
              </p>
            </div>
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-2">Class Management</h2>
              <p className="text-muted-foreground">
                Configure classes, courses, and schedules.
              </p>
            </div>
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-2">System Reports</h2>
              <p className="text-muted-foreground">
                View comprehensive attendance analytics.
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
