import { MONGODB_URL } from '../config/config.js';
import mongoose from 'mongoose';

const _db = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('MongoDB is already connected');
      return;
    }
    
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully');

}catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
export default _db;