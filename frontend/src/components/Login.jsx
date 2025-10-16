// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                email: form.email.trim(),
                password: form.password.trim(),
                role: form.role || 'user'
            };

            const res = await api.post('/auth/login', payload);

            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            login(res.data.user);

            if (res.data.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
           
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFEDEF] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4F191E]">
                        Welcome back
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-t-md focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F]"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F]"
                        />
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-b-md focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F]"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 text-white rounded-md bg-[#E03446] hover:bg-[#BF238B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-[#EF4F5F]">
                        Sign in to your account
                    </p>
                    <p className="mt-2 text-sm text-[#E03446]">
                        Don't have an account? <a href="/register" className="text-[#E03446] hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
