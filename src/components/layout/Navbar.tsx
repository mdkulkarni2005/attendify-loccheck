
import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';

const Navbar = () => {
  const isMobile = useIsMobile();
  const { userRole } = useAuth();
  const [notifications, setNotifications] = useState<string[]>([
    'Attendance session started for CS101',
    'You have been marked present in MAT201'
  ]);

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar userRole={userRole} />
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-lg font-semibold">AttendifyPro</h1>
        </div>

        <div className="flex items-center space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Notifications</h4>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, i) => (
                      <div key={i} className="text-sm p-3 rounded-md bg-muted">
                        {notification}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
