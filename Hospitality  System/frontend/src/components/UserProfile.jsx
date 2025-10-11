import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-2xl leading-6 font-medium text-gray-900 dark:text-white">
                            Profile Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                            Personal details and preferences
                        </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <dl>
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                                    {user?.name || 'Not set'}
                                </dd>
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                                    {user?.email || 'Not set'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Recent Bookings Section */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Recent Bookings
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                No recent bookings found
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite Restaurants Section */}
                <div className="mt-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Favorite Restaurants
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-center text-gray-500 dark:text-gray-400">
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
