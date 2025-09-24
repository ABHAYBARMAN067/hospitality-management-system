
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    return (
        <nav className="bg-white shadow flex items-center justify-between px-6 py-3">
            <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <span role="img" aria-label="logo">🍽️</span> Foodie
            </div>
            <ul className="flex gap-6 text-gray-700 font-medium">
                <li>
                    <a href="/" className="hover:text-indigo-600 transition">Home</a>
                </li>
                {!user && (
                    <>
                        <li>
                            <a href="/login" className="hover:text-indigo-600 transition">Login</a>
                        </li>
                        <li>
                            <a href="/register" className="hover:text-indigo-600 transition">Register</a>
                        </li>
                    </>
                )}
                {user && user.isOwner && (
                    <li>
                        <a href="/admin" className="hover:text-indigo-600 transition font-semibold">Admin Control</a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
