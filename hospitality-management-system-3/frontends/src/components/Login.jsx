// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const payload = { 
                email: form.email.trim(), 
                password: form.password.trim(), 
                role: form.role || 'user' 
            };

            const res = await api.post('/auth/login', payload);

            // Save token in localStorage
            localStorage.setItem('token', res.data.token);

            // Update context
            login(res.data.user);

            // Navigate based on role
            if (res.data.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {error && <div className="text-red-600 text-center">{error}</div>}

                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your password"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Login as</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
