import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from './UI/Navbar';
import api from '../api/api';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my-orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-primary-100 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-2xl leading-6 font-medium text-primary-900">
                            Profile Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-primary-500">
                            Personal details and preferences
                        </p>
                    </div>
                    <div className="border-t border-primary-200">
                        <dl>
                            <div className="bg-primary-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-primary-500">Full name</dt>
                                <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">
                                    {user?.name || 'Not set'}
                                </dd>
                            </div>
                            <div className="bg-primary-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-primary-500">Email address</dt>
                                <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">
                                    {user?.email || 'Not set'}
                                </dd>
                            </div>
                            <div className="bg-primary-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-primary-500">Role</dt>
                                <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">
                                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="mt-8 bg-primary-100 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-primary-900">
                            Recent Orders
                        </h3>
                    </div>
                    <div className="border-t border-primary-200">
                        {loading ? (
                            <div className="px-4 py-5 sm:p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E03446] mx-auto"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="px-4 py-5 sm:p-6 text-center text-primary-500">
                                No recent orders found
                            </div>
                        ) : (
                            <div className="divide-y divide-primary-200">
                                {orders.map((order) => (
                                    <div key={order._id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-primary-900">
                                                    Order #{order._id.slice(-8)}
                                                </p>
                                                <p className="text-sm text-primary-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-primary-500">
                                                    Items: {order.items.length} | Total: ₹{order.totalAmount}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <p className="text-xs text-primary-500 mt-1">
                                                    {order.deliveryType === 'home_delivery' ? 'Home Delivery' : 'Pickup'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Favorite Restaurants Section */}
                <div className="mt-8 bg-primary-100 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-primary-900">
                            Favorite Restaurants
                        </h3>
                    </div>
                    <div className="border-t border-primary-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-center text-primary-500">
                                No favorite restaurants yet
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
