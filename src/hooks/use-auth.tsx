
import { useUser } from "@clerk/clerk-react";
import { UserRole } from "@/types";

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Get user role from public metadata
  const userRole: UserRole = user?.publicMetadata?.role as UserRole || 'student';
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userRole
  };
};
