
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">AttendifyPro</h1>
        <p className="text-muted-foreground">Automated Attendance Management System</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
