import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../api/api.js';

const MenuManagement = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurantAndMenu();
    }, []);

    const fetchRestaurantAndMenu = async () => {
        try {
            const res = await api.get('/admin/my-restaurants');
            if (res.data.length > 0) {
                const rest = res.data[0];
                setRestaurant(rest);
                const menuRes = await api.get(`/menu/restaurant/${rest._id}`);
                setMenuItems(menuRes.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopDish = async (itemId, isTop) => {
        try {
            await api.patch(`/menu/${itemId}`, { isTop });
            setMenuItems(items => items.map(item => item._id === itemId ? { ...item, isTop } : item));
        } catch (err) {
            console.error('Error updating top dish:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Menu Management</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Manage your restaurant's menu items, prices, and availability.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Dish
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                                Image
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Price
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Top Dish
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                        {menuItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                    <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                                    {item.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                                    ₹{item.price}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isTop || false}
                                                        onChange={(e) => toggleTopDish(item._id, e.target.checked)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;
