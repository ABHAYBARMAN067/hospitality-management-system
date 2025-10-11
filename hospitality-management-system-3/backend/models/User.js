import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// Password check method
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
