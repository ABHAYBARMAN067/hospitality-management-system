import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../api/api.js';

const MenuManagement = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: 0,
        isTop: false,
        image: null
    });

    const handleNewItemChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setNewItem(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'price') {
            setNewItem(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else if (files) {
            setNewItem(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setNewItem(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!restaurant) {
            alert('Please add your restaurant first');
            return;
        }
        try {
            const data = new FormData();
            data.append('restaurantId', restaurant._id);
            data.append('name', newItem.name);
            data.append('description', newItem.description);
            data.append('price', newItem.price);
            data.append('isTop', newItem.isTop);
            if (newItem.image) {
                data.append('image', newItem.image);
            }
            const res = await api.post('/menu/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMenuItems(prev => [...prev, res.data]);
            setShowAddModal(false);
            setNewItem({
                name: '',
                description: '',
                price: 0,
                isTop: false,
                image: null
            });
        } catch (err) {
            console.error('Error adding menu item:', err);
            alert('Failed to add dish. Please try again.');
        }
    };

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
        <div className="min-h-screen bg-primary-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-primary-900">Menu Management</h1>
                        <p className="mt-2 text-sm text-primary-700">
                            Manage your restaurant's menu items, prices, and availability.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
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
                                <table className="min-w-full divide-y divide-primary-300">
                                    <thead className="bg-primary-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary-900 sm:pl-6">
                                                Image
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900">
                                                Price
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900">
                                                Top Dish
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary-200 bg-primary-100">
                                        {menuItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                    <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-900">
                                                    {item.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-900">
                                                    ₹{item.price}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isTop || false}
                                                        onChange={(e) => toggleTopDish(item._id, e.target.checked)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                                                    />
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
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

            {showAddModal && (
                <div
                    className="fixed inset-0 bg-primary-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-primary-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-medium leading-6 text-primary-900 mb-4">Add New Dish</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Dish Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleNewItemChange}
                                    required
                                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleNewItemChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleNewItemChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleNewItemChange}
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isTop"
                                    checked={newItem.isTop}
                                    onChange={handleNewItemChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                                />
                                <label className="ml-2 text-sm text-primary-700">Featured Top Dish</label>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    Add Dish
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-primary-100 text-primary-700 py-2 px-4 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>

    );
    {
        showAddModal && (
            <div
                className="fixed inset-0 bg-primary-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                onClick={() => setShowAddModal(false)}
            >
                <div
                    className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-primary-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-lg font-medium leading-6 text-primary-900 mb-4">Add New Dish</h3>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-1">Dish Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={newItem.name}
                                onChange={handleNewItemChange}
                                required
                                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={newItem.description}
                                onChange={handleNewItemChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={newItem.price}
                                onChange={handleNewItemChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-1">Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleNewItemChange}
                                accept="image/*"
                                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isTop"
                                checked={newItem.isTop}
                                onChange={handleNewItemChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                            />
                            <label className="ml-2 text-sm text-primary-700">Featured Top Dish</label>
                        </div>
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Add Dish
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-primary-100 text-primary-700 py-2 px-4 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    
  };

export default MenuManagement;
