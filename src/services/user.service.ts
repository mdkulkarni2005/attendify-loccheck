
import { UserModel } from '@/models';
import { IUser } from '@/models/user.model';
import { connectToDatabase } from '@/lib/db';

export async function createUser(userData: Partial<IUser>) {
  await connectToDatabase();
  // Use type assertion to bypass TypeScript's issue with Mongoose method signatures
  return await UserModel.create(userData) as unknown as IUser;
}

export async function getUserByClerkId(clerkId: string) {
  await connectToDatabase();
  return await UserModel.findOne({ clerkId }) as unknown as IUser | null;
}

export async function getUserById(id: string) {
  await connectToDatabase();
  return await UserModel.findById(id) as unknown as IUser | null;
}

export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return await UserModel.findOne({ email }) as unknown as IUser | null;
}

export async function getAllUsers() {
  await connectToDatabase();
  return await UserModel.find({}).sort({ createdAt: -1 }) as unknown as IUser[];
}

export async function getStudents() {
  await connectToDatabase();
  return await UserModel.find({ role: 'student' }).sort({ name: 1 }) as unknown as IUser[];
}

export async function getTeachers() {
  await connectToDatabase();
  return await UserModel.find({ role: 'teacher' }).sort({ name: 1 }) as unknown as IUser[];
}

export async function getStudentsByClass(className: string) {
  await connectToDatabase();
  return await UserModel.find({ 
    role: 'student',
    class: className
  }).sort({ name: 1 }) as unknown as IUser[];
}

export async function updateUser(userId: string, updateData: Partial<IUser>) {
  await connectToDatabase();
  return await UserModel.findByIdAndUpdate(userId, updateData, { new: true }) as unknown as IUser | null;
}

export async function deleteUser(userId: string) {
  await connectToDatabase();
  return await UserModel.findByIdAndDelete(userId) as unknown as IUser | null;
}

export async function getUsersByDepartment(department: string) {
  await connectToDatabase();
  return await UserModel.find({ department }).sort({ role: 1, name: 1 }) as unknown as IUser[];
}

export async function getUsersByRole(role: string) {
  await connectToDatabase();
  return await UserModel.find({ role }).sort({ name: 1 }) as unknown as IUser[];
}

export async function getUsersByPhoneNumber(phoneNumber: string) {
  await connectToDatabase();
  return await UserModel.find({ phoneNumber }) as unknown as IUser[];
}

export async function bulkCreateUsers(users: Partial<IUser>[]) {
  await connectToDatabase();
  // Cast to any array to bypass type checking
  return await UserModel.insertMany(users as any[]) as unknown as IUser[];
}
