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

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200 cursor-pointer"
        >
          Login
        </button>

        <div className="my-4 text-center text-gray-400">or</div>

        {/* 👉 Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="cursor-pointer w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-2 rounded hover:bg-gray-100 transition"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#EA4335"
              d="M24 9.5c3.4 0 6.4 1.2 8.7 3.2l6-6C34.4 2.1 29.5 0 24 0 14.6 0 6.6 5.9 2.9 14.3l7 5.4C12.2 13.6 17.6 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.7-.2-3.3-.6-4.8H24v9.1h12.5c-.6 3.2-2.5 5.9-5.3 7.7l7 5.5c4.1-3.8 6.5-9.4 6.5-15.5z"
            />
            <path
              fill="#FBBC05"
              d="M10 28.3c-1-2.7-1-5.6 0-8.3l-7-5.4c-3 5.8-3 12.9 0 18.7l7-5z"
            />
            <path
              fill="#34A853"
              d="M24 46c5.5 0 10.2-1.8 13.6-4.8l-7-5.5c-2 1.3-4.5 2-6.6 2-6.4 0-11.8-4.1-13.8-9.6l-7 5.4C6.6 42.1 14.6 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
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