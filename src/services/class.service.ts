
import { ClassModel } from '@/models';
import { IClass } from '@/models/class.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function createClass(classData: Partial<IClass>) {
  await connectToDatabase();
  return await ClassModel.create(classData as any);
}

export async function getClassById(id: string) {
  await connectToDatabase();
  return await ClassModel.findById(id as any);
}

export async function getAllClasses() {
  await connectToDatabase();
  return await ClassModel.find({} as any).sort({ department: 1, name: 1 });
}

export async function getClassesByTeacher(teacherId: string) {
  await connectToDatabase();
  return await ClassModel.find({ teacher: new mongoose.Types.ObjectId(teacherId) } as any).sort({ name: 1 });
}

export async function getClassesByDepartment(department: string) {
  await connectToDatabase();
  return await ClassModel.find({ department } as any).sort({ name: 1 });
}

export async function updateClass(classId: string, updateData: Partial<IClass>) {
  await connectToDatabase();
  return await ClassModel.findByIdAndUpdate(classId, updateData as any, { new: true });
}

export async function deleteClass(classId: string) {
  await connectToDatabase();
  return await ClassModel.findByIdAndDelete(classId as any);
}

export async function getClassByCourseCode(courseCode: string) {
  await connectToDatabase();
  return await ClassModel.findOne({ courseCode } as any);
}

export async function updateClassLocation(classId: string, location: {
  latitude: number;
  longitude: number;
  radius: number;
}) {
  await connectToDatabase();
  return await ClassModel.findByIdAndUpdate(
    classId,
    { location } as any,
    { new: true }
  );
}

export async function bulkCreateClasses(classes: Partial<IClass>[]) {
  await connectToDatabase();
  // Convert partial classes to any to bypass type checking
  return await ClassModel.insertMany(classes as any[]);
}
