import { ClassModel } from '@/models';
import { IClass } from '@/models/class.model';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function createClass(classData: Partial<IClass>) {
  await connectToDatabase();
  return ClassModel.create(classData);
}

export async function getClassById(id: string) {
  await connectToDatabase();
  return ClassModel.findById(id);
}

export async function getAllClasses() {
  await connectToDatabase();
  return ClassModel.find({}).sort({ department: 1, name: 1 });
}

export async function getClassesByTeacher(teacherId: string) {
  await connectToDatabase();
  return ClassModel.find({ teacher: new mongoose.Types.ObjectId(teacherId) }).sort({ name: 1 });
}

export async function getClassesByDepartment(department: string) {
  await connectToDatabase();
  return ClassModel.find({ department }).sort({ name: 1 });
}

export async function updateClass(classId: string, updateData: Partial<IClass>) {
  await connectToDatabase();
  return ClassModel.findByIdAndUpdate(classId, updateData, { new: true });
}

export async function deleteClass(classId: string) {
  await connectToDatabase();
  return ClassModel.findByIdAndDelete(classId);
}

export async function getClassByCourseCode(courseCode: string) {
  await connectToDatabase();
  return ClassModel.findOne({ courseCode });
}

export async function updateClassLocation(classId: string, location: {
  latitude: number;
  longitude: number;
  radius: number;
}) {
  await connectToDatabase();
  return ClassModel.findByIdAndUpdate(
    classId,
    { location },
    { new: true }
  );
}

export async function bulkCreateClasses(classes: Partial<IClass>[]) {
  await connectToDatabase();
  return ClassModel.insertMany(classes);
}