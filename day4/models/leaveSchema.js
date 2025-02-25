import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['annual', 'casual', 'sick']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['inProgress', 'cancelled', 'ended']
  }
}, {timestamps: true});

leaveSchema.set('toJSON', {
  transform: (doc, {__v, ...rest}) => rest
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
