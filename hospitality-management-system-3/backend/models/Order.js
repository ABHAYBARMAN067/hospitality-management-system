import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        {
            menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            quantity: { type: Number, default: 1 },
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'preparing', 'delivered'], default: 'pending' },
});

export default mongoose.model('Order', OrderSchema);
