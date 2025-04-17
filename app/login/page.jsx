'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Using next-auth signIn function
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      // ✅ Store JWT token in localStorage (if desired)
      if (res?.token) {
        localStorage.setItem('token', res.token); // Save the token in localStorage
      }

      // ✅ Session is now created, user will be available in Navbar
      router.push('/'); // Redirect to home page after login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-black/30 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200"
        >
          Login
        </button>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-400 hover:text-blue-500 underline transition"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;