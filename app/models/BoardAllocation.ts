import mongoose from "mongoose";

export interface IBoardAllocation extends mongoose.Document {
  boardNumber: number;
  day: "saturday" | "sunday";
  timeSlot: string;
  currentUsers: number;
  maxUsers: number;
  users: mongoose.Types.ObjectId[];
  lastUpdated: Date;
}

const BoardAllocationSchema = new mongoose.Schema<IBoardAllocation>({
  boardNumber: { type: Number, required: true, min: 1, max: 6 },
  day: { type: String, enum: ["saturday", "sunday"], required: true },
  timeSlot: { type: String, required: true },
  currentUsers: { type: Number, default: 0 },
  maxUsers: { type: Number, default: 6 },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: () => [],
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

// Pre-save middleware to ensure users array exists and currentUsers is correct
BoardAllocationSchema.pre("save", function (next) {
  // Ensure users is always an array
  if (!Array.isArray(this.users)) {
    this.users = [];
  }

  // Sync currentUsers with users array length
  this.currentUsers = this.users.length;

  next();
});

// Post-init middleware (runs after document is loaded from DB)
BoardAllocationSchema.post("init", function (doc) {
  // Ensure users array exists when loading from database
  if (!Array.isArray(doc.users)) {
    doc.users = [];
  }
});

BoardAllocationSchema.index({ boardNumber: 1, day: 1, timeSlot: 1 }, { unique: true });

export default mongoose.models.BoardAllocation ||
  mongoose.model<IBoardAllocation>("BoardAllocation", BoardAllocationSchema);
