import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password, formData.role);
    if (result.success) {
      alert('Login successful!');
      // Optionally redirect based on role
      if (formData.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Login as:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                className="mr-2"
              />
              User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="mr-2"
              />
              Admin
            </label>
          </div>
        </div>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mr-2 p-2 border" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="mr-2 p-2 border" required />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}

export default Login;
