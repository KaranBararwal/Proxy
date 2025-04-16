import mongoose from 'mongoose';

const proxySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  student: { type: String, required: true },
  date: { type: String, required: true },
  markedBy: { type: String, required: true }, // email of the user
});

const Proxy = mongoose.models.Proxy || mongoose.model('Proxy', proxySchema);
export default Proxy;