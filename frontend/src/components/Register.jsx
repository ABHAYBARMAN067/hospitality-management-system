import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/auth/register', form);
            if (res.status === 201) {
                toast.success("Registration successful!");
                setForm({ name: '', email: '', password: '', role: 'user' });
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] focus:z-10 sm:text-sm"
                                style={{ color: 'black' }}
                                placeholder="Password"
                            />
                        </div>

                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="role" className="sr-only">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] rounded-b-md focus:z-10 sm:text-sm"
                                style={{ color: 'black' }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>



                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#E03446' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
