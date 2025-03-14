import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassItem } from '@/types/classes';

interface AddClassDialogProps {
  onAddClass: (newClass: Omit<ClassItem, 'id'>) => void;
  onCancel: () => void;
}

const AddClassDialog = ({ 
  onAddClass, 
  onCancel 
}: AddClassDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    department: 'Computer Science',
    room: '',
    teacher: '',
    students: 0,
    schedule: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClass(formData);
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

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogDescription>
          Enter the details for the new class
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Class Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courseCode" className="text-right">Course Code</Label>
            <Input
              id="courseCode"
              value={formData.courseCode}
              onChange={(e) => handleChange('courseCode', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">Room</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => handleChange('room', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">Teacher</Label>
            <Input
              id="teacher"
              value={formData.teacher}
              onChange={(e) => handleChange('teacher', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="students" className="text-right">Students</Label>
            <Input
              id="students"
              type="number"
              min="0"
              value={formData.students}
              onChange={(e) => handleChange('students', parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule" className="text-right">Schedule</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              className="col-span-3"
              placeholder="E.g., Mon, Wed, Fri 10:00-11:30"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Class</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddClassDialog;