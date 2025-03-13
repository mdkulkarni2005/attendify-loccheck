
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { School, Home, User, UsersRound, Clock } from 'lucide-react';
import { ClassItem } from '@/types/classes';

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
  if (!selectedClass) return null;
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Class: {selectedClass.name}</DialogTitle>
        <DialogDescription>
          Course Code: {selectedClass.courseCode}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
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
      </div>
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="secondary"
          onClick={onStartAttendance}
          className="sm:w-auto w-full"
        >
          Start Attendance
        </Button>
        <Button 
          onClick={onUpdateClass}
          className="sm:w-auto w-full"
        >
          Update Class
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ClassManagementDialog;
