'use client';
import { useState } from 'react';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input name="name" onChange={handleChange} placeholder="Name" className="mb-2 p-2 w-full border" />
      <input name="email" onChange={handleChange} placeholder="Email" className="mb-2 p-2 w-full border" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" className="mb-4 p-2 w-full border" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
