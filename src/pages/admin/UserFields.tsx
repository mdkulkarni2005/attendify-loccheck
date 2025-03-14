import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Custom field type for users
interface UserField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  required: boolean;
  options?: string[]; // For select fields
  applyTo: 'student' | 'teacher' | 'both';
}

const UserFields = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<UserField[]>([
    {
      id: 'field-1',
      name: 'Roll Number',
      type: 'text',
      required: true,
      applyTo: 'student'
    },
    {
      id: 'field-2',
      name: 'Department',
      type: 'select',
      required: true,
      options: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry'],
      applyTo: 'teacher'
    },
    {
      id: 'field-3',
      name: 'Class',
      type: 'select',
      required: true,
      options: ['CS101', 'CS202', 'MATH101', 'PHY101'],
      applyTo: 'student'
    }
  ]);

  const [newField, setNewField] = useState<Omit<UserField, 'id'>>({
    name: '',
    type: 'text',
    required: false,
    applyTo: 'student'
  });

  const handleAddField = () => {
    if (!newField.name.trim()) {
      toast({
        title: "Error",
        description: "Field name is required",
        variant: "destructive"
      });
      return;
    }

    const id = `field-${Date.now()}`;
    setFields([...fields, { ...newField, id }]);
    setNewField({
      name: '',
      type: 'text',
      required: false,
      applyTo: 'student'
    });

    toast({
      title: "Field Added",
      description: `${newField.name} has been added successfully`
    });
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    toast({
      title: "Field Deleted",
      description: "The field has been removed"
    });
  };

  const handleNewFieldChange = (key: string, value: any) => {
    setNewField({ ...newField, [key]: value });
  };

  const handleSaveFields = () => {
    // In a real app, this would save to a database
    toast({
      title: "Fields Saved",
      description: "User fields have been updated successfully"
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Fields Management</h1>
          <p className="text-muted-foreground">
            Configure additional fields for student and teacher profiles
          </p>
        </div>

        <Tabs defaultValue="student">
          <TabsList>
            <TabsTrigger value="student">Student Fields</TabsTrigger>
            <TabsTrigger value="teacher">Teacher Fields</TabsTrigger>
            <TabsTrigger value="add">Add New Field</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {fields
                .filter(field => field.applyTo === 'student' || field.applyTo === 'both')
                .map(field => (
                  <Card key={field.id}>
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{field.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <CardDescription>
                        Type: {field.type} | {field.required ? 'Required' : 'Optional'}
                      </CardDescription>
                    </CardHeader>
                    {field.type === 'select' && field.options && (
                      <CardContent>
                        <div className="text-sm">
                          <span className="font-medium">Options:</span>{' '}
                          {field.options.join(', ')}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="teacher" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {fields
                .filter(field => field.applyTo === 'teacher' || field.applyTo === 'both')
                .map(field => (
                  <Card key={field.id}>
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{field.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <CardDescription>
                        Type: {field.type} | {field.required ? 'Required' : 'Optional'}
                      </CardDescription>
                    </CardHeader>
                    {field.type === 'select' && field.options && (
                      <CardContent>
                        <div className="text-sm">
                          <span className="font-medium">Options:</span>{' '}
                          {field.options.join(', ')}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Field</CardTitle>
                <CardDescription>
                  Define a new field for user profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-name">Field Name</Label>
                    <Input
                      id="field-name"
                      value={newField.name}
                      onChange={(e) => handleNewFieldChange('name', e.target.value)}
                      placeholder="e.g., Graduation Year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-type">Field Type</Label>
                    <select
                      id="field-type"
                      value={newField.type}
                      onChange={(e) => handleNewFieldChange('type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select (Dropdown)</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>

                {newField.type === 'select' && (
                  <div className="space-y-2">
                    <Label htmlFor="field-options">Options (comma-separated)</Label>
                    <Input
                      id="field-options"
                      placeholder="Option 1, Option 2, Option 3"
                      onChange={(e) => {
                        const options = e.target.value.split(',').map(o => o.trim()).filter(o => o);
                        handleNewFieldChange('options', options);
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Apply To</Label>
                  <RadioGroup
                    value={newField.applyTo}
                    onValueChange={(value) => handleNewFieldChange('applyTo', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="apply-student" />
                      <Label htmlFor="apply-student">Students Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="apply-teacher" />
                      <Label htmlFor="apply-teacher">Teachers Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="apply-both" />
                      <Label htmlFor="apply-both">Both Students and Teachers</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="field-required"
                    checked={newField.required}
                    onChange={(e) => handleNewFieldChange('required', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="field-required">This field is required</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveFields}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserFields;