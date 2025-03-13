
import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { useAuth } from '@/hooks/use-auth';

const SignUpPage = () => {
  const { isSignedIn } = useAuth();

  // If already logged in, redirect to dashboard
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">AttendifyPro</h1>
        <p className="text-muted-foreground">Automated Attendance Management System</p>
      </div>
      <div className="w-full max-w-md">
        <SignUp 
          routing="path" 
          path="/signup"
          signInUrl="/login"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'bg-background shadow-md',
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
