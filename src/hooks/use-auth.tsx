
import { useUser } from "@clerk/clerk-react";
import { UserRole } from "@/types";

// Admin email - hardcoded for demonstration
const ADMIN_EMAIL = "kedarmanas171@gmail.com";

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Determine user role
  let userRole: UserRole = 'student'; // Default role
  
  if (user) {
    // Check if the user is the predefined admin
    if (user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      userRole = 'admin';
    } else {
      // Get user role from public metadata, default to student if not set
      userRole = (user.publicMetadata?.role as UserRole) || 'student';
    }
  }
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userRole,
    isAdmin: userRole === 'admin'
  };
};
