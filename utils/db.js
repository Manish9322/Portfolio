import { MONGODB_URL } from '../config/config.js';
import mongoose from 'mongoose';
import Skill from '../models/Skills.model'; // Adjust path to your Skill model

const _db = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('MongoDB is already connected');
      return;
    }
    
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully');

    // Run migration to add order field to existing skills
    await migrateSkillsOrder();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

async function migrateSkillsOrder() {
  try {
    const result = await Skill.updateMany(
      { order: { $exists: false } },
      { $set: { order: 0 } }
    );
    console.log(`Skill order migration: Updated ${result.modifiedCount} skills.`);
  } catch (error) {
    console.error('Skill order migration failed:', error.message);
  }
}

export default _db;