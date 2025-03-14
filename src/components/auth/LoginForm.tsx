
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LoginForm = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'clerk'>('student');
  const [showStudentFields, setShowStudentFields] = useState(true);
  const [showTeacherFields, setShowTeacherFields] = useState(false);
  
  // Form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rollNumber: '',
    class: '',
    department: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    class: '',
    department: ''
  });
  
  // Update fields visibility based on role
  useEffect(() => {
    setShowStudentFields(userRole === 'student');
    setShowTeacherFields(userRole === 'teacher');
  }, [userRole]);
  
  const handleLoginChange = (field: string, value: string) => {
    setLoginData({ ...loginData, [field]: value });
  };
  
  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would handle authentication with Clerk
    // and save user metadata with the additional fields
    console.log('Login data:', loginData);
    
    // For now, we'll just redirect to the dashboard
    navigate('/dashboard');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={loginData.email}
                  onChange={(e) => handleLoginChange('email', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={loginData.password}
                  onChange={(e) => handleLoginChange('password', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup 
                  defaultValue="student" 
                  value={userRole}
                  onValueChange={(value) => setUserRole(value as any)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clerk" id="clerk" />
                    <Label htmlFor="clerk">Clerk</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Student specific fields */}
              {showStudentFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input 
                      id="rollNumber" 
                      placeholder="e.g., S12345" 
                      value={loginData.rollNumber}
                      onChange={(e) => handleLoginChange('rollNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={loginData.class}
                      onValueChange={(value) => handleLoginChange('class', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS101">CS101 - Intro to Computer Science</SelectItem>
                        <SelectItem value="CS202">CS202 - Data Structures</SelectItem>
                        <SelectItem value="MATH101">MATH101 - Calculus</SelectItem>
                        <SelectItem value="PHY101">PHY101 - Physics I</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {/* Teacher specific fields */}
              {showTeacherFields && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={loginData.department}
                    onValueChange={(value) => handleLoginChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign In</Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Register data:', registerData);
            navigate('/dashboard');
          }}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input 
                  id="register-name" 
                  placeholder="John Doe" 
                  value={registerData.name}
                  onChange={(e) => handleRegisterChange('name', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={registerData.email}
                  onChange={(e) => handleRegisterChange('email', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  value={registerData.password}
                  onChange={(e) => handleRegisterChange('password', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup 
                  value={registerData.role}
                  onValueChange={(value) => {
                    handleRegisterChange('role', value);
                    setShowStudentFields(value === 'student');
                    setShowTeacherFields(value === 'teacher');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="r-student" />
                    <Label htmlFor="r-student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="r-teacher" />
                    <Label htmlFor="r-teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Student specific fields - Register */}
              {showStudentFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="register-rollNumber">Roll Number</Label>
                    <Input 
                      id="register-rollNumber" 
                      placeholder="e.g., S12345" 
                      value={registerData.rollNumber}
                      onChange={(e) => handleRegisterChange('rollNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-class">Class</Label>
                    <Select
                      value={registerData.class}
                      onValueChange={(value) => handleRegisterChange('class', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS101">CS101 - Intro to Computer Science</SelectItem>
                        <SelectItem value="CS202">CS202 - Data Structures</SelectItem>
                        <SelectItem value="MATH101">MATH101 - Calculus</SelectItem>
                        <SelectItem value="PHY101">PHY101 - Physics I</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {/* Teacher specific fields - Register */}
              {showTeacherFields && (
                <div className="space-y-2">
                  <Label htmlFor="register-department">Department</Label>
                  <Select
                    value={registerData.department}
                    onValueChange={(value) => handleRegisterChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Create Account</Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
