
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  // In a real app, this would come from authentication
  const [userRole] = useState<'teacher' | 'student' | 'clerk'>('teacher');

  return (
    <MainLayout>
      {userRole === 'teacher' ? (
        <TeacherDashboard />
      ) : userRole === 'student' ? (
        <StudentDashboard />
      ) : (
        <div>Clerk Dashboard</div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
