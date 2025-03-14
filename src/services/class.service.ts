
import { ClassModel } from '@/models';
import { IClass } from '@/models/class.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function createClass(classData: Partial<IClass>) {
  await connectToDatabase();
  return await (ClassModel.create(classData) as Promise<IClass>);
}

export async function getClassById(id: string) {
  await connectToDatabase();
  return await (ClassModel.findById(id) as any) as IClass | null;
}

export async function getAllClasses() {
  await connectToDatabase();
  return await (ClassModel.find({}).sort({ department: 1, name: 1 }) as any) as IClass[];
}

export async function getClassesByTeacher(teacherId: string) {
  await connectToDatabase();
  return await (ClassModel.find({ teacher: new mongoose.Types.ObjectId(teacherId) }).sort({ name: 1 }) as any) as IClass[];
}

export async function getClassesByDepartment(department: string) {
  await connectToDatabase();
  return await (ClassModel.find({ department }).sort({ name: 1 }) as any) as IClass[];
}

export async function updateClass(classId: string, updateData: Partial<IClass>) {
  await connectToDatabase();
  return await (ClassModel.findByIdAndUpdate(classId, updateData, { new: true }) as any) as IClass | null;
}

export async function deleteClass(classId: string) {
  await connectToDatabase();
  return await (ClassModel.findByIdAndDelete(classId) as any) as IClass | null;
}

export async function getClassByCourseCode(courseCode: string) {
  await connectToDatabase();
  return await (ClassModel.findOne({ courseCode }) as any) as IClass | null;
}

export async function updateClassLocation(classId: string, location: {
  latitude: number;
  longitude: number;
  radius: number;
}) {
  await connectToDatabase();
  return await (ClassModel.findByIdAndUpdate(
    classId,
    { location },
    { new: true }
  ) as any) as IClass | null;
}

export async function bulkCreateClasses(classes: Partial<IClass>[]) {
  await connectToDatabase();
  // Cast to any array to bypass type checking
  return await (ClassModel.insertMany(classes as any[]) as any) as IClass[];
}
