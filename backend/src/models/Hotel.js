import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Hotel name is required"],
      trim: true,
      maxlength: [100, "Hotel name cannot exceed 100 characters"]
    },
    city: { 
      type: String, 
      required: [true, "City is required"],
      trim: true
    },
    address: { 
      type: String, 
      required: [true, "Address is required"],
      trim: true
    },
    image: { 
      type: String, 
      required: [true, "Hotel image is required"]
    }, // Cloudinary URL
    topDishes: [{ 
      name: { 
        type: String, 
        required: [true, "Dish name is required"],
        trim: true
      }, 
      image: { 
        type: String, 
        required: [true, "Dish image is required"]
      } // Cloudinary URL
    }],
    admin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Admin is required"]
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0
    },
    priceRange: {
      type: String,
      enum: ["Budget", "Moderate", "Expensive", "Luxury"],
      default: "Moderate"
    },
    cuisine: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    openingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "22:00" }
    },
    contactInfo: {
      phone: String,
      email: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for hotel's tables
hotelSchema.virtual('tables', {
  ref: 'Table',
  localField: '_id',
  foreignField: 'hotel'
});

// Virtual for hotel's bookings
hotelSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'hotel'
});

// Indexes for better query performance
hotelSchema.index({ city: 1 });
hotelSchema.index({ admin: 1 });
hotelSchema.index({ isActive: 1 });
hotelSchema.index({ name: 'text', city: 'text' });

export default mongoose.model("Hotel", hotelSchema);
