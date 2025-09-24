import React from 'react';

const UserProfile = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">User Profile</h2>
            {/* Show user info, bookings, orders, favorites */}
            <p className="text-gray-600">Profile details go here.</p>
        </div>
    </div>
);

export default UserProfile;
