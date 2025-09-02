import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    hotel: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Hotel", 
      required: [true, "Hotel is required"]
    },
    name: { 
      type: String, 
      required: [true, "Table name is required"],
      trim: true
    },
    seats: { 
      type: Number, 
      required: [true, "Number of seats is required"],
      min: [1, "Table must have at least 1 seat"],
      max: [20, "Table cannot have more than 20 seats"]
    },
    isAvailable: { 
      type: Boolean, 
      default: true 
    },
    tableType: {
      type: String,
      enum: ["Indoor", "Outdoor", "Private", "Bar", "VIP"],
      default: "Indoor"
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"]
    },
    image: {
      type: String // Cloudinary URL for table image
    },
    amenities: {
      type: [String],
      default: []
    },
    isReserved: {
      type: Boolean,
      default: false
    },
    reservedUntil: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for table's bookings
tableSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'table'
});

// Indexes for better query performance
tableSchema.index({ hotel: 1 });
tableSchema.index({ isAvailable: 1 });
tableSchema.index({ seats: 1 });
tableSchema.index({ hotel: 1, isAvailable: 1 });

export default mongoose.model("Table", tableSchema);
