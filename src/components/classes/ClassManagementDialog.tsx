
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { School, Home, User, UsersRound, Clock, Edit, Save } from 'lucide-react';
import { ClassItem } from '@/types/classes';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassManagementDialogProps {
  selectedClass: ClassItem | null;
  onUpdateClass: () => void;
  onStartAttendance: () => void;
}

const ClassManagementDialog = ({ 
  selectedClass, 
  onUpdateClass, 
  onStartAttendance 
}: ClassManagementDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClassItem | null>(null);
  
  useEffect(() => {
    if (selectedClass) {
      setFormData({ ...selectedClass });
    }
  }, [selectedClass]);
  
  if (!selectedClass || !formData) return null;
  
  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const departments = [
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClass();
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Class: {selectedClass.name}</DialogTitle>
        <DialogDescription>
          Course Code: {selectedClass.courseCode}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="view">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" onClick={() => setIsEditing(false)}>View Details</TabsTrigger>
          <TabsTrigger value="edit" onClick={() => setIsEditing(true)}>Edit Class</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="font-medium mb-2">Class Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Department: {selectedClass.department}</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Room: {selectedClass.room}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Teacher: {selectedClass.teacher}</span>
                </div>
                <div className="flex items-center">
                  <UsersRound className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Students: {selectedClass.students}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Schedule: {selectedClass.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-2">
              <div className="grid items-center gap-4">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode}
                  onChange={(e) => handleChange('courseCode', e.target.value)}
                  required
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => handleChange('room', e.target.value)}
                  required
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="teacher">Teacher</Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => handleChange('teacher', e.target.value)}
                  required
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="students">Students</Label>
                <Input
                  id="students"
                  type="number"
                  min="0"
                  value={formData.students}
                  onChange={(e) => handleChange('students', parseInt(e.target.value))}
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => handleChange('schedule', e.target.value)}
                  placeholder="E.g., Mon, Wed, Fri 10:00-11:30"
                />
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={onStartAttendance}
          className="sm:w-auto w-full"
        >
          Start Attendance
        </Button>
        {isEditing ? (
          <Button 
            onClick={onUpdateClass}
            className="sm:w-auto w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            className="sm:w-auto w-full"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Class
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default ClassManagementDialog;
