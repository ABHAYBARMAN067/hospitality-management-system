import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="mr-2 p-2 border" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mr-2 p-2 border" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="mr-2 p-2 border" required />
        <select name="role" value={formData.role} onChange={handleChange} className="mr-2 p-2 border">
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
    </div>
  );
}

export default Register;
