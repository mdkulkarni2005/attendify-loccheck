
import { useUser } from "@clerk/clerk-react";
import { UserRole } from "@/types";

// Admin email - hardcoded for demonstration
const ADMIN_EMAIL = "kedarmanas171@gmail.com";

// List of valid teacher email domains or specific emails
const TEACHER_EMAILS = [
  "teacher@university.edu",
  "faculty@college.edu",
  "@faculty.edu", // Any email with this domain
  "@professors.edu"
];

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Determine user role
  let userRole: UserRole = 'student'; // Default role
  let userDepartment: string | undefined;
  let userClass: string | undefined;
  let userRollNumber: string | undefined;
  
  if (user) {
    const userEmail = user.primaryEmailAddress?.emailAddress || '';
    
    // Check if the user is the predefined admin
    if (userEmail === ADMIN_EMAIL) {
      userRole = 'admin';
    } else {
      // First check public metadata for role, which takes precedence
      const metadataRole = user.publicMetadata?.role as UserRole;
      
      if (metadataRole) {
        userRole = metadataRole;
      } else {
        // If no role in metadata, check if email matches teacher patterns
        const isTeacherEmail = TEACHER_EMAILS.some(pattern => {
          if (pattern.startsWith('@')) {
            // Domain check
            return userEmail.endsWith(pattern);
          } else {
            // Exact email check
            return userEmail === pattern;
          }
        });
        
        userRole = isTeacherEmail ? 'teacher' : 'student';
      }
    }
    
    // Get additional user data from metadata
    userDepartment = user.publicMetadata?.department as string;
    userClass = user.publicMetadata?.class as string;
    userRollNumber = user.publicMetadata?.rollNumber as string;
  }
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userRole,
    userDepartment,
    userClass,
    userRollNumber,
    isAdmin: userRole === 'admin',
    isTeacher: userRole === 'teacher',
    isStudent: userRole === 'student'
  };
};
