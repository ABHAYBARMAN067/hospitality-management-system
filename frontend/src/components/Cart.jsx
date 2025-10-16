import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './UI/Navbar';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { cart, restaurantId, restaurantName } = location.state || { cart: [], restaurantId: '', restaurantName: '' };

    const [deliveryType, setDeliveryType] = useState('pickup');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState('');

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (deliveryType === 'home_delivery' && !deliveryAddress.trim()) {
            setOrderError('Please enter delivery address');
            return;
        }

        setOrderLoading(true);
        setOrderError('');

        try {
            const orderData = {
                restaurantId,
                items: cart.map(item => ({
                    menuItemId: item.menuItemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount,
                deliveryType,
                deliveryAddress: deliveryType === 'home_delivery' ? deliveryAddress : undefined,
                paymentMethod
            };

            const res = await api.post('/orders', orderData);
            toast.success('Order placed successfully!');
            navigate('/profile'); // Redirect to profile or orders page
        } catch (error) {
            setOrderError(error.response?.data?.error || 'Failed to place order');
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-primary-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary-900">Your cart is empty</h2>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-4 py-2 bg-[#E03446] text-white rounded-lg hover:bg-[#BF238B] transition-colors"
                        >
                            Browse Restaurants
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-primary-900 mb-6">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-primary-100 shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Summary</h2>
                        <p className="text-primary-700 mb-4">Restaurant: {restaurantName}</p>

                        <div className="space-y-4">
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-primary-900">{item.name}</p>
                                        <p className="text-sm text-primary-500">₹{item.price} x {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-primary-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between items-center text-lg font-bold text-primary-900">
                                <span>Total:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div className="bg-primary-100 shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-primary-900 mb-4">Delivery Options</h2>

                        {orderError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {orderError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">
                                    Delivery Type
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="pickup"
                                            checked={deliveryType === 'pickup'}
                                            onChange={(e) => setDeliveryType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Pickup from restaurant
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="home_delivery"
                                            checked={deliveryType === 'home_delivery'}
                                            onChange={(e) => setDeliveryType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Home Delivery
                                    </label>
                                </div>
                            </div>

                            {deliveryType === 'home_delivery' && (
                                <div>
                                    <label className="block text-sm font-medium text-primary-700 mb-1">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Enter your delivery address"
                                        className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                                        rows="3"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                                >
                                    <option value="cash">Cash on Delivery</option>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={orderLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E03446] hover:bg-[#BF238B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E03446] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {orderLoading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;
