import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI!;
console.log('MONGO_URI:', MONGO_URI);

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env.local");
}

let cached = (global as any).mongoose;
if(!cached) {
  cached = (global as any).mongoose = {conn: null, promise: null};
}


export async function connectToDatabase() {
  if(cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  if(!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
  cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  });
}  

cached.conn = await cached.promise;
 return cached.conn;
}

