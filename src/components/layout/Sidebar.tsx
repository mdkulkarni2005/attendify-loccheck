
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/clerk-react';
import {
  Users,
  Calendar,
  BookOpen,
  CheckSquare,
  Table,
  FileSpreadsheet,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar = ({ userRole = 'student' }: SidebarProps) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const teacherNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Table className="h-5 w-5" /> },
    { href: '/classes', label: 'My Classes', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/timetable', label: 'Timetable', icon: <Calendar className="h-5 w-5" /> },
    { href: '/attendance', label: 'Attendance', icon: <CheckSquare className="h-5 w-5" /> },
    { href: '/reports', label: 'Reports', icon: <FileSpreadsheet className="h-5 w-5" /> },
  ];

  const studentNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Table className="h-5 w-5" /> },
    { href: '/classes', label: 'My Classes', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/attendance', label: 'Attendance', icon: <CheckSquare className="h-5 w-5" /> },
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Table className="h-5 w-5" /> },
    { href: '/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { href: '/classes', label: 'Classes', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/reports', label: 'Reports', icon: <FileSpreadsheet className="h-5 w-5" /> },
  ];

  const navItems = 
    userRole === 'teacher' 
      ? teacherNavItems 
      : userRole === 'student' 
        ? studentNavItems 
        : adminNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="w-64 bg-sidebar h-full flex flex-col border-r">
      <div className="flex items-center h-14 px-4 border-b">
        <span className="font-bold text-lg">AttendifyPro</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
                item.href === '/dashboard' && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="grid gap-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start px-3 py-2"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
