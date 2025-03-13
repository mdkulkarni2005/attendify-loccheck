
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  userRole?: UserRole;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const Sidebar = ({ userRole = 'student' }: SidebarProps) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: <Table className="h-5 w-5" />,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/admin', 
      label: 'Admin Panel', 
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin']
    },
    { 
      href: '/users', 
      label: 'Users', 
      icon: <Users className="h-5 w-5" />,
      roles: ['admin']
    },
    { 
      href: '/classes', 
      label: 'Classes', 
      icon: <BookOpen className="h-5 w-5" />,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/timetable', 
      label: 'Timetable', 
      icon: <Calendar className="h-5 w-5" />,
      roles: ['teacher', 'student']
    },
    { 
      href: '/attendance', 
      label: 'Attendance', 
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/reports', 
      label: 'Reports', 
      icon: <FileSpreadsheet className="h-5 w-5" />,
      roles: ['admin', 'teacher']
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if current path is active or if it's a parent route
  const isActiveRoute = (path: string) => {
    if (location.pathname === path) return true;
    
    // For nested routes like /users/123, highlight the parent /users route
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  return (
    <div className={cn(
      "bg-sidebar h-full flex flex-col border-r transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-14 px-4 border-b">
        {!collapsed && <span className="font-bold text-lg">AttendifyPro</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute -right-3 top-10 rounded-full border border-border bg-background h-6 w-6",
            isMobile && "hidden"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 
            <ChevronRight className="h-3 w-3" /> : 
            <ChevronLeft className="h-3 w-3" />
          }
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
                isActiveRoute(item.href) && "bg-sidebar-accent text-sidebar-primary font-medium"
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="grid gap-1">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
              location.pathname === '/settings' && "bg-sidebar-accent text-sidebar-primary font-medium"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <UserCog className="h-5 w-5" />
            {!collapsed && "Settings"}
          </Link>
          <Button 
            variant="ghost" 
            className={cn(
              "justify-start px-3 py-2",
              collapsed && "px-3 py-2 justify-center"
            )}
            onClick={handleSignOut}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
