
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import SearchInput from '@/components/ui/search-input';
import ClassesList from '@/components/classes/ClassesList';
import ClassManagementDialog from '@/components/classes/ClassManagementDialog';
import AddClassDialog from '@/components/classes/AddClassDialog';
import DepartmentFilter from '@/components/classes/DepartmentFilter';
import TeacherFilter from '@/components/classes/TeacherFilter';
import { ClassItem } from '@/types/classes';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
  
  const handleAddClass = (newClass: Omit<ClassItem, 'id'>) => {
    const id = `class-${Date.now()}`;
    const classToAdd: ClassItem = {
      id,
      ...newClass
    };
    
    setClasses([...classes, classToAdd]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Class Added",
      description: `${newClass.name} has been added successfully`,
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
          <Button onClick={() => setIsAddDialogOpen(true)}>
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
            <ClassesList 
              classes={filteredClasses} 
              searchTerm={searchTerm} 
              onManage={handleManageClass} 
            />
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4 mt-6">
            <DepartmentFilter
              selectedDepartment={selectedDepartment}
              onDepartmentChange={handleDepartmentChange}
              filteredClasses={filteredClasses}
              onManage={handleManageClass}
            />
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4 mt-6">
            <TeacherFilter
              selectedTeacher={selectedTeacher}
              onTeacherChange={handleTeacherChange}
              filteredClasses={filteredClasses}
              onManage={handleManageClass}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog for managing existing class */}
      <Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <ClassManagementDialog
          selectedClass={selectedClass}
          onUpdateClass={() => {
            handleUpdateClass();
            setSelectedClass(null);
          }}
          onStartAttendance={() => {
            handleStartAttendance();
            setSelectedClass(null);
          }}
        />
      </Dialog>
      
      {/* Dialog for adding new class */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddClassDialog 
          onAddClass={handleAddClass}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </Dialog>
    </MainLayout>
  );
};

export default Classes;
