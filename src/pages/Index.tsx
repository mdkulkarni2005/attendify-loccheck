
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, MapPin, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/90 to-primary px-4 py-16 sm:py-24 text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                AttendifyPro
              </h1>
              <p className="text-xl md:text-2xl max-w-xl">
                The smartest way to manage attendance with location-based validation
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/dashboard')}
                >
                  View Demo
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckSquare className="w-32 h-32 text-white/80" strokeWidth={1} />
                </div>
                <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-secondary/90 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-secondary-foreground" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Different interfaces and permissions for teachers, students, and administrators.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Validation</h3>
              <p className="text-muted-foreground">
                Prevent proxy attendance with precise location tracking and verification.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Sessions</h3>
              <p className="text-muted-foreground">
                Create attendance sessions automatically based on class timetables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Transform Attendance Management?</h2>
          <p className="text-lg">
            Join thousands of educational institutions already using AttendifyPro to streamline their attendance process.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-secondary hover:bg-white/90"
            onClick={() => navigate('/login')}
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold">AttendifyPro</h3>
              <p className="text-muted-foreground">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
