import mongoose from 'mongoose';

const ProxySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  student: { type: String, required: true },
  date: { type: String, required: true },
  markedBy: { type: String, required: true },
  markedFor: { type: String, required: true },
  status: { type: String, default: 'pending' }, // can be 'pending', 'accepted', 'rejected'
});

// ✅ Prevent model overwrite error in development
const Proxy = mongoose.models.Proxy || mongoose.model('Proxy', ProxySchema);

export default Proxy;