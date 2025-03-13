
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School } from 'lucide-react';
import { ClassItem } from '@/types/classes';
import ClassCard from './ClassCard';

interface DepartmentFilterProps {
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  filteredClasses: ClassItem[];
  onManage: (cls: ClassItem) => void;
}

const DepartmentFilter = ({ 
  selectedDepartment, 
  onDepartmentChange, 
  filteredClasses, 
  onManage 
}: DepartmentFilterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter by Department</CardTitle>
        <CardDescription>Select a department to view its classes</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
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
              <ClassCard key={cls.id} cls={cls} onManage={onManage} />
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
  );
};

export default DepartmentFilter;
