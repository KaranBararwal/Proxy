'use client';

import { useSession, signOut, signIn } from 'next-auth/react'; // Added signIn import
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SetPasswordPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.hasPassword) {
      router.push('/');
    }
  }, [status, session?.user?.hasPassword, router]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (username) {
        const res = await fetch(`/api/check-username?username=${username}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } else {
        setUsernameAvailable(null);
      }
    };
  
    const debounce = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounce);
  }, [username]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password , username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Re-login silently to refresh session
      await signIn('credentials', {
        redirect: false,
        email: session.user.email,
        password,
      });

      router.push('/');  // After setting the password, navigate to home
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Set Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {usernameAvailable === false && (
              <p className="text-red-500 text-sm mb-2">Username is already taken</p>
            )}
            {usernameAvailable === true && (
              <p className="text-green-500 text-sm mb-2">Username is available</p>
            )}

          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Setting...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
