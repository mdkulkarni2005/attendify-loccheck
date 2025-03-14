import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://mdkulkarni2005:fTMRgVkOSSAi2ujn@cluster0.14syy.mongodb.net/attendify';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect to MongoDB when the app starts
connectToDatabase().catch(console.error);

export default mongoose;