import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique : true ,  sparse: true , required : false }, // ✅ added
  email: { type: String, required: true, unique: true },
  password: { type: String, default : null },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;