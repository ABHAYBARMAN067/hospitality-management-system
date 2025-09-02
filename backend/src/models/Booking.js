import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User is required"]
    },
    hotel: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Hotel", 
      required: [true, "Hotel is required"]
    },
    table: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Table", 
      required: [true, "Table is required"]
    },
    date: { 
      type: Date, 
      required: [true, "Booking date is required"],
      validate: {
        validator: function(value) {
          return value > new Date();
        },
        message: "Booking date must be in the future"
      }
    },
    time: {
      type: String,
      required: [true, "Booking time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in HH:MM format"]
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest is required"],
      max: [20, "Cannot book for more than 20 guests"]
    },
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"], 
      default: "Pending" 
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"]
    },
    totalAmount: {
      type: Number,
      min: [0, "Amount cannot be negative"],
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending"
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online", "UPI"],
      default: "Cash"
    },
    cancellationReason: {
      type: String,
      maxlength: [200, "Cancellation reason cannot exceed 200 characters"]
    },
    isConfirmed: {
      type: Boolean,
      default: false
    },
    confirmedAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  return this.date ? Math.ceil((this.date - new Date()) / (1000 * 60 * 60 * 24)) : 0;
});

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date ? this.date.toLocaleDateString() : '';
});

// Indexes for better query performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ table: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ user: 1, date: 1 });
bookingSchema.index({ hotel: 1, date: 1 });

// Pre-save middleware to set confirmedAt when status changes to Confirmed
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Confirmed' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'Cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
