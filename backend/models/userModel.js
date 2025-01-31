import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"]
  },
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email already exists."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  country: {
    type: String,
    required: true,
    enum: ['Slovakia', 'Czech Republic', 'Spain', 'Other'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
})

export const User = mongoose.model.User || mongoose.model('User', UserSchema);