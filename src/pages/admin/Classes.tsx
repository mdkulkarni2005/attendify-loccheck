
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, School, Home, User, BookOpenCheck, UsersRound, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchInput from '@/components/ui/search-input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface ClassItem {
  id: string;
  name: string;
  courseCode: string;
  department: string;
  room: string;
  teacher: string;
  students?: number;
  schedule?: string;
}

const Classes = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>(
    Array.from({ length: 6 }).map((_, i) => ({
      id: `class-${i}`,
      name: `Class ${String.fromCharCode(65 + i)}`,
      courseCode: `CS10${i}`,
      department: 'Computer Science',
      room: `Room ${100 + i}`,
      teacher: ['John Doe', 'Jane Smith', 'Robert Johnson'][i % 3],
      students: Math.floor(Math.random() * 30) + 20,
      schedule: ['Mon, Wed, Fri 10:00 - 11:30', 'Tue, Thu 14:00 - 15:30', 'Mon, Wed 13:00 - 14:30'][i % 3]
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>(classes);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  useEffect(() => {
    let result = classes;
    
    if (searchTerm) {
      result = result.filter(
        cls => 
          cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredClasses(result);
  }, [classes, searchTerm]);

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = classes.filter(cls => 
        cls.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
      setFilteredClasses(filtered);
    }
  }, [selectedDepartment, classes]);

  useEffect(() => {
    if (selectedTeacher) {
      const filtered = classes.filter(cls => 
        cls.teacher.toLowerCase() === selectedTeacher.toLowerCase()
      );
      setFilteredClasses(filtered);
    }
  }, [selectedTeacher, classes]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedDepartment('');
    setSelectedTeacher('');
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSearchTerm('');
    setSelectedTeacher('');
  };

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
    setSearchTerm('');
    setSelectedDepartment('');
  };

  const handleManageClass = (cls: ClassItem) => {
    setSelectedClass(cls);
  };

  const handleUpdateClass = () => {
    toast({
      title: "Class Updated",
      description: `${selectedClass?.name} has been updated successfully`,
    });
  };

  const handleStartAttendance = () => {
    toast({
      title: "Attendance Started",
      description: `Attendance session started for ${selectedClass?.name}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Class Management
            </h1>
            <p className="text-muted-foreground">
              Manage classes, courses, and schedules
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Class
          </Button>
        </div>
        
        <div className="w-full mb-6">
          <SearchInput
            placeholder="Search classes, course codes or teachers..."
            onSearch={handleSearch}
            className="max-w-full md:max-w-md"
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="departments">By Department</TabsTrigger>
            <TabsTrigger value="teachers">By Teacher</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <Card key={cls.id} className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <CardDescription>Course Code: {cls.courseCode}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <School className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.department}</span>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.room}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.teacher}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersRound className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.students} Students</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.schedule}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleManageClass(cls)}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Manage Class: {selectedClass?.name}</DialogTitle>
                            <DialogDescription>
                              Course Code: {selectedClass?.courseCode}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-6">
                              <div>
                                <h3 className="font-medium mb-2">Class Details</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Department: {selectedClass?.department}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Room: {selectedClass?.room}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Teacher: {selectedClass?.teacher}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <UsersRound className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Students: {selectedClass?.students}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Schedule: {selectedClass?.schedule}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="secondary"
                              onClick={handleStartAttendance}
                              className="sm:w-auto w-full"
                            >
                              Start Attendance
                            </Button>
                            <Button 
                              onClick={handleUpdateClass}
                              className="sm:w-auto w-full"
                            >
                              Update Class
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
                  <BookOpenCheck className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No classes found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Try a different search term' : 'No classes match the current filter'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter by Department</CardTitle>
                <CardDescription>Select a department to view its classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="w-full mb-6">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedDepartment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClasses.map((cls) => (
                      <Card key={cls.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{cls.name}</CardTitle>
                          <CardDescription>Course Code: {cls.courseCode}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{cls.room}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{cls.teacher}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleManageClass(cls)}
                              >
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Manage Class: {selectedClass?.name}</DialogTitle>
                                <DialogDescription>
                                  Course Code: {selectedClass?.courseCode}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 gap-6">
                                  <div>
                                    <h3 className="font-medium mb-2">Class Details</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <School className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Department: {selectedClass?.department}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Room: {selectedClass?.room}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Teacher: {selectedClass?.teacher}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={handleStartAttendance}
                                  className="sm:w-auto w-full"
                                >
                                  Start Attendance
                                </Button>
                                <Button 
                                  onClick={handleUpdateClass}
                                  className="sm:w-auto w-full"
                                >
                                  Update Class
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <School className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p>Select a department to view classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter by Teacher</CardTitle>
                <CardDescription>Select a teacher to view their classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTeacher} onValueChange={handleTeacherChange}>
                  <SelectTrigger className="w-full mb-6">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john doe">John Doe</SelectItem>
                    <SelectItem value="jane smith">Jane Smith</SelectItem>
                    <SelectItem value="robert johnson">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedTeacher ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClasses.map((cls) => (
                      <Card key={cls.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{cls.name}</CardTitle>
                          <CardDescription>Course Code: {cls.courseCode}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <School className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{cls.department}</span>
                            </div>
                            <div className="flex items-center">
                              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{cls.room}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleManageClass(cls)}
                              >
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Manage Class: {selectedClass?.name}</DialogTitle>
                                <DialogDescription>
                                  Course Code: {selectedClass?.courseCode}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 gap-6">
                                  <div>
                                    <h3 className="font-medium mb-2">Class Details</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <School className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Department: {selectedClass?.department}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Room: {selectedClass?.room}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>Teacher: {selectedClass?.teacher}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={handleStartAttendance}
                                  className="sm:w-auto w-full"
                                >
                                  Start Attendance
                                </Button>
                                <Button 
                                  onClick={handleUpdateClass}
                                  className="sm:w-auto w-full"
                                >
                                  Update Class
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <User className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p>Select a teacher to view their classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Classes;
