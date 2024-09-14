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
})

export const User = mongoose.model.User || mongoose.model('User', UserSchema);