import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-primary-50">
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

                {/* Recent Bookings Section */}
                <div className="mt-8 bg-primary-100 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-primary-900">
                            Recent Bookings
                        </h3>
                    </div>
                    <div className="border-t border-primary-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-center text-primary-500">
                                No recent bookings found
                            </div>
                        </div>
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
