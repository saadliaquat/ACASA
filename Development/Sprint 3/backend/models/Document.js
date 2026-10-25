import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  controlId: { type: Number, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
