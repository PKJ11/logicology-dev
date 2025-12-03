import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  phone: string;
  userType: 'school' | 'non-school';
  schoolDetails?: {
    schoolName: string;
    schoolId: string;
    address: string;
    city: string;
  };
  paymentStatus: 'pending' | 'completed' | 'exempted';
  paymentId?: string;
  amountPaid: number;
  isVerified: boolean;
  competitionSlot?: {
    day: 'saturday' | 'sunday';
    timeSlot: string;
    boardNumber: number;
    slotTime: Date;
  };
  selectedSlot: {
  day: 'saturday' | 'sunday';
  timeSlot: string;
  selectedAt: Date;
};
  registeredAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['school', 'non-school'], 
    required: true 
  },
  schoolDetails: {
    schoolName: String,
    schoolId: String,
    address: String,
    city: String,
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'exempted'], 
    default: 'pending' 
  },
  paymentId: String,
  amountPaid: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  competitionSlot: {
    day: { type: String, enum: ['saturday', 'sunday'] },
    timeSlot: String,
    boardNumber: { type: Number, min: 1, max: 6 },
    slotTime: Date,
  },
  selectedSlot: {
    day: { type: String, enum: ['saturday', 'sunday'] },
    timeSlot: String,
    selectedAt: { type: Date }
  },
  registeredAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);