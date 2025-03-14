
import { UserModel } from '@/models';
import { IUser } from '@/models/user.model';
import { connectToDatabase } from '@/lib/db';

export async function createUser(userData: Partial<IUser>) {
  await connectToDatabase();
  return await UserModel.create(userData as any);
}

export async function getUserByClerkId(clerkId: string) {
  await connectToDatabase();
  return await UserModel.findOne({ clerkId } as any);
}

export async function getUserById(id: string) {
  await connectToDatabase();
  return await UserModel.findById(id as any);
}

export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return await UserModel.findOne({ email } as any);
}

export async function getAllUsers() {
  await connectToDatabase();
  return await UserModel.find({} as any).sort({ createdAt: -1 });
}

export async function getStudents() {
  await connectToDatabase();
  return await UserModel.find({ role: 'student' } as any).sort({ name: 1 });
}

export async function getTeachers() {
  await connectToDatabase();
  return await UserModel.find({ role: 'teacher' } as any).sort({ name: 1 });
}

export async function getStudentsByClass(className: string) {
  await connectToDatabase();
  return await UserModel.find({ 
    role: 'student',
    class: className
  } as any).sort({ name: 1 });
}

export async function updateUser(userId: string, updateData: Partial<IUser>) {
  await connectToDatabase();
  return await UserModel.findByIdAndUpdate(userId, updateData as any, { new: true });
}

export async function deleteUser(userId: string) {
  await connectToDatabase();
  return await UserModel.findByIdAndDelete(userId as any);
}

export async function getUsersByDepartment(department: string) {
  await connectToDatabase();
  return await UserModel.find({ department } as any).sort({ role: 1, name: 1 });
}

export async function getUsersByRole(role: string) {
  await connectToDatabase();
  return await UserModel.find({ role } as any).sort({ name: 1 });
}

export async function getUsersByPhoneNumber(phoneNumber: string) {
  await connectToDatabase();
  return await UserModel.find({ phoneNumber } as any);
}

export async function bulkCreateUsers(users: Partial<IUser>[]) {
  await connectToDatabase();
  // Convert partial users to any to bypass type checking
  return await UserModel.insertMany(users as any[]);
}
