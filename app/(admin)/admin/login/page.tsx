// pages/admin/login.tsx
'use client';
import { isAuthenticated } from '@/lib/auth';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');

  const  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    if (password) {
      const response = await axios.get('/api/login', {
          params: {
            ...(password && { password }),
          },
        });
      localStorage.setItem('admin_password', response.data.token);
      window.location.href = '/admin'; // Redirect to the admin page after successful login
      } 
    else {
      alert('Invalid password');
    }}
    catch (error) {alert('Invalid password');}
  };

    useEffect(() => {
      if (isAuthenticated()) {
        window.location.href = '/admin'; 
      }
    }, []);

  return (
    <form onSubmit={handleSubmit} className="text-center mt-12 flex flex-col gap-2 items-center bg-white p-4 justify-center sm:w-1/2 md:w-1/2 lg:w-1/5 sm:mx-auto mx-8">
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        className="outline-none border border-black w-full px-2 py-1 rounded-sm"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="border border-black w-full px-2 py-1 rounded-sm bg-blue-300">
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
