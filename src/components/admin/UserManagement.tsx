
import React, { useState, useEffect } from 'react';
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
  Phone,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SearchInput from '@/components/ui/search-input';
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
    { 
      id: '4', 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      role: 'teacher' 
    },
    { 
      id: '5', 
      name: 'Emily Wilson', 
      email: 'emily@example.com', 
      role: 'student' 
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    phoneNumber: '',
  });
  
  // Filter users based on search term and role filter
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole) {
      result = result.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, filterRole]);
  
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
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Invalid Input",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (users.length + 1).toString();
    const createdUser = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber || undefined
    };
    
    setUsers([...users, createdUser]);
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      phoneNumber: '',
    });
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}`,
    });
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">User Management</CardTitle>
              <CardDescription>Manage users and their roles</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <SearchInput
                placeholder="Search users..."
                onSearch={handleSearch}
                className="max-w-sm"
              />
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
            {filteredUsers.length > 0 ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try a different search term' : 'No users match the current filter'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
