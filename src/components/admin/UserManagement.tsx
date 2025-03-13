
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search,
  UserCog,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserManagementProps {
  filterRole?: UserRole;
}

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
};

const UserManagement = ({ filterRole }: UserManagementProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Kedar Manas', 
      email: 'kedarmanas171@gmail.com', 
      role: 'admin',
      phoneNumber: '9226793192'
    },
    { 
      id: '2', 
      name: 'John Smith', 
      email: 'john@example.com', 
      role: 'teacher' 
    },
    { 
      id: '3', 
      name: 'Jane Doe', 
      email: 'jane@example.com', 
      role: 'student' 
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handlePromoteToAdmin = (user: User) => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, role: 'admin' as UserRole } : u
    );
    setUsers(updatedUsers);
    
    toast({
      title: "Role Updated",
      description: `${user.name} has been promoted to admin`,
    });
  };
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    setSelectedUser(null);
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}`,
    });
  };
  
  const filteredUsers = filterRole 
    ? users.filter(user => user.role === filterRole)
    : users;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">User Management</CardTitle>
              <CardDescription>Manage users and their roles</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-4">Name</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 items-center p-3 text-sm">
                  <div className="col-span-4 font-medium">{user.name}</div>
                  <div className="col-span-4 text-muted-foreground">{user.email}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                        : user.role === 'teacher'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedUser(user)}
                        >
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Edit user</span>
                        </Button>
                      </DialogTrigger>
                      {selectedUser && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Change role for {selectedUser.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <p className="text-right text-sm font-medium col-span-1">Name:</p>
                              <p className="col-span-3">{selectedUser.name}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <p className="text-right text-sm font-medium col-span-1">Email:</p>
                              <p className="flex items-center col-span-3">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                {selectedUser.email}
                              </p>
                            </div>
                            {selectedUser.phoneNumber && (
                              <div className="grid grid-cols-4 items-center gap-4">
                                <p className="text-right text-sm font-medium col-span-1">Phone:</p>
                                <p className="flex items-center col-span-3">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {selectedUser.phoneNumber}
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <p className="text-right text-sm font-medium col-span-1">Role:</p>
                              <div className="flex gap-2 col-span-3">
                                <Button 
                                  variant={selectedUser.role === 'student' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleRoleChange(selectedUser.id, 'student')}
                                >
                                  Student
                                </Button>
                                <Button 
                                  variant={selectedUser.role === 'teacher' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleRoleChange(selectedUser.id, 'teacher')}
                                >
                                  Teacher
                                </Button>
                                <Button 
                                  variant={selectedUser.role === 'admin' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                                >
                                  Admin
                                </Button>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" onClick={() => setSelectedUser(null)}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    
                    {user.role === 'teacher' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                        onClick={() => handlePromoteToAdmin(user)}
                      >
                        <Shield className="h-4 w-4" />
                        <span className="sr-only">Promote to admin</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
