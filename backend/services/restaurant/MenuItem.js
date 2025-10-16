import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String, // Cloudinary URL
    isTop: { type: Boolean, default: false },
});

export default mongoose.model('MenuItem', MenuItemSchema);
