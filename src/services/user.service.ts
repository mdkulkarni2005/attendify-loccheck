import { UserModel } from '@/models';
import { IUser } from '@/models/user.model';
import { connectToDatabase } from '@/lib/db';

export async function createUser(userData: Partial<IUser>) {
  await connectToDatabase();
  return UserModel.create(userData);
}

export async function getUserByClerkId(clerkId: string) {
  await connectToDatabase();
  return UserModel.findOne({ clerkId });
}

export async function getUserById(id: string) {
  await connectToDatabase();
  return UserModel.findById(id);
}

export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return UserModel.findOne({ email });
}

export async function getAllUsers() {
  await connectToDatabase();
  return UserModel.find({}).sort({ createdAt: -1 });
}

export async function getStudents() {
  await connectToDatabase();
  return UserModel.find({ role: 'student' }).sort({ name: 1 });
}

export async function getTeachers() {
  await connectToDatabase();
  return UserModel.find({ role: 'teacher' }).sort({ name: 1 });
}

export async function getStudentsByClass(className: string) {
  await connectToDatabase();
  return UserModel.find({ 
    role: 'student',
    class: className
  }).sort({ name: 1 });
}

export async function updateUser(userId: string, updateData: Partial<IUser>) {
  await connectToDatabase();
  return UserModel.findByIdAndUpdate(userId, updateData, { new: true });
}

export async function deleteUser(userId: string) {
  await connectToDatabase();
  return UserModel.findByIdAndDelete(userId);
}

export async function getUsersByDepartment(department: string) {
  await connectToDatabase();
  return UserModel.find({ department }).sort({ role: 1, name: 1 });
}

export async function getUsersByRole(role: string) {
  await connectToDatabase();
  return UserModel.find({ role }).sort({ name: 1 });
}

export async function getUsersByPhoneNumber(phoneNumber: string) {
  await connectToDatabase();
  return UserModel.find({ phoneNumber });
}

export async function bulkCreateUsers(users: Partial<IUser>[]) {
  await connectToDatabase();
  return UserModel.insertMany(users);
}