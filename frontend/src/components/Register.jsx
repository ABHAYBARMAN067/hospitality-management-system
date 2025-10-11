import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setForm(f => ({ ...f, role: checked ? 'admin' : 'user' }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage(""); setError("");
        try {
            const res = await api.post('/auth/register', form);
            if (res.status === 201) {
                setMessage("Registration successful!");
                setForm({ name: '', email: '', password: '', role: 'user' });
                if (res.data.user.role === 'admin') navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFEDEF' }}>
            <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: 'black' }}>
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm" style={{ color: 'black' }}>
                        Join us today
                    </p>
                </div>

                {message && (
                    <div className="border-l-4 p-4 mb-4" style={{ backgroundColor: '#FFEDEF', borderColor: '#EF4F5F' }}>
                        <p className="text-sm" style={{ color: '#E03446' }}>{message}</p>
                    </div>
                )}

                {error && (
                    <div className="border-l-4 p-4" style={{ backgroundColor: '#FFEDEF', borderColor: '#EF4F5F' }}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5" style={{ color: '#E03446' }} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm" style={{ color: '#E03446' }}>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] rounded-t-md focus:z-10 sm:text-sm"
                                style={{ color: 'black' }}
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] focus:z-10 sm:text-sm"
                                style={{ color: 'black' }}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] rounded-b-md focus:z-10 sm:text-sm"
                                style={{ color: 'black' }}
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="admin-checkbox"
                            type="checkbox"
                            checked={form.role === 'admin'}
                            onChange={handleChange}
                            className="h-4 w-4 focus:ring-[#EF4F5F] border-gray-300 rounded cursor-pointer"
                            style={{ color: '#E03446' }}
                        />
                        <label htmlFor="admin-checkbox" className="ml-2 block text-sm cursor-pointer" style={{ color: 'black' }}>
                            Register as Admin
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F] transition-colors duration-200"
                            style={{ backgroundColor: '#E03446' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
