
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Edit, Plus, Save, Trash2, BookOpen, MapPin } from 'lucide-react';

type TimetableDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

type TimetableEntry = {
  id: string;
  day: TimetableDay;
  classId: string;
  className: string;
  courseCode: string;
  room: string;
  startTime: string;
  endTime: string;
};

const TimetableManagement = () => {
  const { toast } = useToast();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([
    {
      id: '1',
      day: 'monday',
      classId: 'cs101',
      className: 'Introduction to Computer Science',
      courseCode: 'CS101',
      room: 'A-101',
      startTime: '10:00',
      endTime: '11:30',
    },
    {
      id: '2',
      day: 'monday',
      classId: 'cs202',
      className: 'Data Structures',
      courseCode: 'CS202',
      room: 'B-203',
      startTime: '13:00',
      endTime: '14:30',
    },
    {
      id: '3',
      day: 'tuesday',
      classId: 'cs303',
      className: 'Algorithms',
      courseCode: 'CS303',
      room: 'C-105',
      startTime: '15:00',
      endTime: '16:30',
    },
  ]);
  
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [currentDay, setCurrentDay] = useState<TimetableDay>('monday');
  
  const days: TimetableDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const filteredEntries = timetable.filter(entry => entry.day === currentDay);
  
  const handleAdd = () => {
    const newEntry: TimetableEntry = {
      id: Date.now().toString(),
      day: currentDay,
      classId: '',
      className: '',
      courseCode: '',
      room: '',
      startTime: '09:00',
      endTime: '10:30',
    };
    setEditingEntry(newEntry);
    setIsAddingEntry(true);
  };
  
  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry({ ...entry });
    setIsAddingEntry(false);
  };
  
  const handleSave = () => {
    if (!editingEntry) return;
    
    if (isAddingEntry) {
      setTimetable([...timetable, editingEntry]);
      toast({
        title: "Schedule Added",
        description: `New class added to ${currentDay}'s schedule`,
      });
    } else {
      setTimetable(timetable.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      ));
      toast({
        title: "Schedule Updated",
        description: `Schedule for ${editingEntry.courseCode} has been updated`,
      });
    }
    setEditingEntry(null);
  };
  
  const handleDelete = (id: string) => {
    setTimetable(timetable.filter(entry => entry.id !== id));
    toast({
      title: "Schedule Removed",
      description: "The class has been removed from the timetable",
      variant: "destructive",
    });
  };
  
  const handleEntryChange = (key: keyof TimetableEntry, value: string) => {
    if (!editingEntry) return;
    setEditingEntry({ ...editingEntry, [key]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Timetable Management</CardTitle>
              <CardDescription>Manage school or college timetables</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex space-x-2 border-b overflow-x-auto pb-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={currentDay === day ? "default" : "outline"}
                  className="capitalize"
                  onClick={() => setCurrentDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No classes scheduled for {currentDay}. Click "Add Class" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <div className="flex justify-between p-4 bg-muted/20">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">{entry.courseCode}: {entry.className}</h3>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {entry.startTime} - {entry.endTime}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        Room: {entry.room}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingEntry ? 'Add New Class' : 'Edit Class'}</DialogTitle>
            <DialogDescription>
              {isAddingEntry 
                ? `Add a new class to ${currentDay}'s schedule` 
                : `Update the details for this class`}
            </DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Code</label>
                  <Input 
                    value={editingEntry.courseCode} 
                    onChange={(e) => handleEntryChange('courseCode', e.target.value)}
                    placeholder="e.g. CS101"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room</label>
                  <Input 
                    value={editingEntry.room} 
                    onChange={(e) => handleEntryChange('room', e.target.value)}
                    placeholder="e.g. A-101"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <Input 
                  value={editingEntry.className} 
                  onChange={(e) => handleEntryChange('className', e.target.value)}
                  placeholder="e.g. Introduction to Computer Science"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input 
                    type="time"
                    value={editingEntry.startTime} 
                    onChange={(e) => handleEntryChange('startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input 
                    type="time"
                    value={editingEntry.endTime} 
                    onChange={(e) => handleEntryChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {isAddingEntry ? 'Add' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimetableManagement;
