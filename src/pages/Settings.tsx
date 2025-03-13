
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Shield, 
  UserCog,
  Save,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Settings = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    name: 'Kedar Manas',
    email: 'kedarmanas171@gmail.com',
    phone: '9226793192',
    department: 'Computer Science',
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: false,
    browser: true,
  });
  
  const [appSettings, setAppSettings] = useState({
    theme: 'system',
    language: 'en',
    fontSize: 'medium',
    compactMode: false,
    autoLogout: true,
  });
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully",
    });
  };
  
  const handlePasswordChange = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (securityForm.newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    });
    
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved",
    });
  };
  
  const handleSaveAppSettings = () => {
    toast({
      title: "App Settings Updated",
      description: "Your application settings have been saved",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="app">App Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={profileForm.department} 
                      onValueChange={(value) => setProfileForm({...profileForm, department: value})}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-muted/50">
                  <div className="flex items-start space-x-4">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Current Role: {userRole}</h4>
                      <p className="text-sm text-muted-foreground">
                        Your role determines what features and data you can access in the system.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={securityForm.currentPassword} 
                    onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={securityForm.newPassword} 
                      onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={securityForm.confirmPassword} 
                      onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Password must:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Be at least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePasswordChange}>
                  Update Password
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a verification code via SMS
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a verification code via email
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authenticator App</Label>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app to generate codes
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Class Updates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.email} 
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings, 
                          email: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via SMS
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.sms} 
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings, 
                          sms: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">System Notifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.push} 
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings, 
                          push: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>Browser Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.browser} 
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings, 
                          browser: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="app" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Application Settings
                </CardTitle>
                <CardDescription>
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={appSettings.theme} 
                      onValueChange={(value) => setAppSettings({...appSettings, theme: value})}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">System Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={appSettings.language} 
                      onValueChange={(value) => setAppSettings({...appSettings, language: value})}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>English</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select 
                      value={appSettings.fontSize} 
                      onValueChange={(value) => setAppSettings({...appSettings, fontSize: value})}
                    >
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing to show more content
                        </p>
                      </div>
                      <Switch 
                        checked={appSettings.compactMode} 
                        onCheckedChange={(checked) => setAppSettings({
                          ...appSettings, 
                          compactMode: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label>Auto Logout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after inactivity
                        </p>
                      </div>
                      <Switch 
                        checked={appSettings.autoLogout} 
                        onCheckedChange={(checked) => setAppSettings({
                          ...appSettings, 
                          autoLogout: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAppSettings}>
                  Save App Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
