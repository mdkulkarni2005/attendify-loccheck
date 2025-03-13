
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, School, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Classes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="departments">By Department</TabsTrigger>
            <TabsTrigger value="teachers">By Teacher</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Class {String.fromCharCode(65 + i)}</CardTitle>
                    <CardDescription>Course Code: CS10{i}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Computer Science Department</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Room {100 + i}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">Manage</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter by Department</CardTitle>
                <CardDescription>Select a department to view its classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger className="w-full mb-6">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-center text-muted-foreground">
                  Select a department to view classes
                </div>
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
                <Select>
                  <SelectTrigger className="w-full mb-6">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher1">John Doe</SelectItem>
                    <SelectItem value="teacher2">Jane Smith</SelectItem>
                    <SelectItem value="teacher3">Robert Johnson</SelectItem>
                    <SelectItem value="teacher4">Sarah Williams</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-center text-muted-foreground">
                  Select a teacher to view their classes
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Classes;
