import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cachedConnection.conn) return cachedConnection.conn;

  if (!cachedConnection.promise) {
    // 👇 Removed deprecated options here
    cachedConnection.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}