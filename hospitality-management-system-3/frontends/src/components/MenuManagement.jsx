import React from 'react';


const MenuManagement = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Menu Management</h3>
            <button className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">+ Add Dish</button>
            <table className="w-full text-left border-t border-gray-200">
                <thead>
                    <tr className="text-gray-600">
                        <th className="py-2">Image</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Example row, replace with map of menu items */}
                    <tr className="border-b">
                        <td className="py-2"><img src="https://via.placeholder.com/40" alt="dish" className="w-10 h-10 rounded object-cover" /></td>
                        <td className="py-2">Paneer Tikka</td>
                        <td className="py-2">₹250</td>
                        <td className="py-2 flex gap-2">
                            <button className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition">Edit</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="text-gray-600 mt-6">Manage your restaurant's menu here.</p>
        </div>
    </div>
);

export default MenuManagement;
