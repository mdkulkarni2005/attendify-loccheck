
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkLoaded } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import RouteGuard from "./components/auth/RouteGuard";
import Users from "./pages/admin/Users";
import Classes from "./pages/admin/Classes";
import Reports from "./pages/admin/Reports";
import UserFields from "./pages/admin/UserFields";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkLoaded>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/signup/*" element={<SignUp />} />
            <Route path="/dashboard" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            <Route path="/attendance" element={
              <RouteGuard>
                <Attendance />
              </RouteGuard>
            } />
            <Route path="/admin" element={
              <RouteGuard allowedRoles={['admin']}>
                <AdminPanel />
              </RouteGuard>
            } />
            <Route path="/users" element={
              <RouteGuard allowedRoles={['admin']}>
                <Users />
              </RouteGuard>
            } />
            <Route path="/classes" element={
              <RouteGuard>
                <Classes />
              </RouteGuard>
            } />
            <Route path="/reports" element={
              <RouteGuard allowedRoles={['admin']}>
                <Reports />
              </RouteGuard>
            } />
            <Route path="/user-fields" element={
              <RouteGuard allowedRoles={['admin']}>
                <UserFields />
              </RouteGuard>
            } />
            <Route path="/timetable" element={
              <RouteGuard>
                <Timetable />
              </RouteGuard>
            } />
            <Route path="/settings" element={
              <RouteGuard>
                <Settings />
              </RouteGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
