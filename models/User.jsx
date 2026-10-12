import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    unique : true ,
    sparse: true ,
    required : false,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default : null,
  },
  resetToken: { 
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  role :{
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;