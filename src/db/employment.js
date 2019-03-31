import mongoose from 'mongoose';

const EmploymentSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,        
  },  
  email: {
    type: String,
    required: true,
    unique: true,
  }, 
  company_id:{
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model('Employment', EmploymentSchema);