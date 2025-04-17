'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (form.username) {
        const res = await fetch(`/api/check-username?username=${form.username}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } else {
        setUsernameAvailable(null);
      }
    };

    const debounce = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounce);
  }, [form.username]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      return alert('Please enter a valid email');
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      await signIn('credentials', {
        redirect: true,
        email: form.email,
        password: form.password,
        callbackUrl: '/',
      });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded-2xl p-10 w-full max-w-md transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Create an Account</h2>

        <div className="mb-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
          />
          {usernameAvailable === false && (
            <p className="text-red-400 text-sm mt-1">Username is already taken</p>
          )}
          {usernameAvailable === true && (
            <p className="text-green-400 text-sm mt-1">Username is available</p>
          )}
        </div>

        <div className="mb-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
          />
        </div>

        <div className="mb-6">
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={usernameAvailable === false}
          className={`w-full py-2 px-4 text-white cursor-pointer rounded-md font-semibold transition duration-200 ${
            usernameAvailable === false
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}
