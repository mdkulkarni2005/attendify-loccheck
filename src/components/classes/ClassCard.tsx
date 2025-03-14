
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, Home, User, UsersRound, Clock } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ClassItem } from '@/types/classes';

interface ClassCardProps {
  cls: ClassItem;
  onManage: (cls: ClassItem) => void;
}

const ClassCard = ({ cls, onManage }: ClassCardProps) => {
  return (
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
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onManage(cls)}
        >
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;
