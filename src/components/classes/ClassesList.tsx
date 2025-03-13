
import React from 'react';
import { BookOpenCheck } from 'lucide-react';
import { ClassItem } from '@/types/classes';
import ClassCard from './ClassCard';

interface ClassesListProps {
  classes: ClassItem[];
  searchTerm: string;
  onManage: (cls: ClassItem) => void;
}

const ClassesList = ({ classes, searchTerm, onManage }: ClassesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.length > 0 ? (
        classes.map((cls) => (
          <ClassCard key={cls.id} cls={cls} onManage={onManage} />
        ))
      ) : (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
          <BookOpenCheck className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No classes found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try a different search term' : 'No classes match the current filter'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
