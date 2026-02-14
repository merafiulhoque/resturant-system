// src/lib/db/connect.ts

import mongoose from 'mongoose';
import { DB_CONFIG } from '@/constants';

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseConnection;
};

let cached: MongooseConnection = globalWithMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

/**
 * Connect to MongoDB
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  cached.promise = mongoose
    .connect(DB_CONFIG.MONGODB_URI)
    .then((conn) => {
      console.log('✅ MongoDB connected successfully');
      cached.conn = conn;
      return conn;
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    });

  return cached.promise;
}

/**
 * Disconnect from MongoDB
 */
export async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
  }
}