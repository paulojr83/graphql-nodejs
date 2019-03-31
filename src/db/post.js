import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },  
  user_id: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model('Post', PostSchema);