
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { ClassItem } from '@/types/classes';
import ClassCard from './ClassCard';

interface TeacherFilterProps {
  selectedTeacher: string;
  onTeacherChange: (value: string) => void;
  filteredClasses: ClassItem[];
  onManage: (cls: ClassItem) => void;
}

const TeacherFilter = ({ 
  selectedTeacher, 
  onTeacherChange, 
  filteredClasses, 
  onManage 
}: TeacherFilterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter by Teacher</CardTitle>
        <CardDescription>Select a teacher to view their classes</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedTeacher} onValueChange={onTeacherChange}>
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
              <ClassCard key={cls.id} cls={cls} onManage={onManage} />
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
  );
};

export default TeacherFilter;
