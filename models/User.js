import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Supervisor', 'Cleaner', 'Reporter'],
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'approved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
