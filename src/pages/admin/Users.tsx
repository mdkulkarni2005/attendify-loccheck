
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users as UsersIcon, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserManagement from '@/components/admin/UserManagement';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    phoneNumber: '',
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Invalid Input",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API to create the user
    setIsAddUserDialogOpen(false);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}`,
    });
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      phoneNumber: '',
    });
    
    // Force a refresh of the UserManagement component
    // In a real app, this would happen via proper state management
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users and their roles in the system
            </p>
          </div>
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with specific role
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium col-span-1">Name:</label>
                  <Input 
                    className="col-span-3" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium col-span-1">Email:</label>
                  <Input 
                    className="col-span-3" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium col-span-1">Phone:</label>
                  <Input 
                    className="col-span-3" 
                    type="tel"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium col-span-1">Role:</label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement filterRole="teacher" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement filterRole="student" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Users;
