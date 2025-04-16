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
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        className="mb-2 p-2 w-full border"
      />
      {usernameAvailable === false && (
        <p className="text-red-500 text-sm">Username is already taken</p>
      )}
      {usernameAvailable === true && (
        <p className="text-green-500 text-sm">Username is available</p>
      )}

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-2 p-2 w-full border"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="mb-4 p-2 w-full border"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={usernameAvailable === false}
      >
        Register
      </button>
    </form>
  );
}