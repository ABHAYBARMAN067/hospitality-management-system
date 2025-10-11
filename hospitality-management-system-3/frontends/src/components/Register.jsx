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
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-12 bg-white p-8 rounded-lg shadow flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center mb-2">Register</h2>
            {message && <div className="text-green-600 text-center">{message}</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="px-4 py-2 border rounded focus:outline-none focus:ring" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="px-4 py-2 border rounded focus:outline-none focus:ring" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="px-4 py-2 border rounded focus:outline-none focus:ring" />

            <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.role === 'admin'} onChange={handleChange} className="accent-indigo-600" /> Register as Admin
            </label>

            <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Register</button>
        </form>
    );
};

export default Register;
