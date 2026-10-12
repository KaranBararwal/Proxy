
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  FaLayerGroup,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaExclamationCircle,
} from 'react-icons/fa';

const GoogleIcon = () => (
  <svg
    className="h-5 w-5 shrink-0"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
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
  </svg>
);

export default function SignUp() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const username = form.username.trim();

    if (!username) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }

    // Wait until the user pauses typing before checking.
    const controller = new AbortController();

    const debounce = setTimeout(async () => {
      setCheckingUsername(true);
      setUsernameAvailable(null);

      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error('Username check failed');
        }

        const data = await res.json();

        if (!controller.signal.aborted) {
          setUsernameAvailable(data.available === true);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Username check failed:', err);
          if (!controller.signal.aborted) {
            setUsernameAvailable(null);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setCheckingUsername(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [form.username]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) return;

    setError('');

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email || !form.password) {
      setError('Please complete all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (usernameAvailable === false) {
      setError('That username is already taken. Please choose another.');
      return;
    }

    if (usernameAvailable !== true) {
      setError('Please wait until username availability has been confirmed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed.');
      }

      // Sign in after account creation.
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password: form.password,
        callbackUrl: '/',
      });

      if (signInResult?.error) {
        setSuccess(true);
        setError(
          'Your account was created, but automatic sign-in failed. Please sign in with your new account.'
        );
        return;
      }

      if (signInResult?.url) {
        window.location.assign(signInResult.url);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (loading || googleLoading) return;

    setError('');
    setGoogleLoading(true);

    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error('Google sign-up failed:', err);
      setError('Unable to continue with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d19] px-4 py-28 text-white sm:px-6">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <Link
          href="/"
          className="mb-7 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/30">
            <FaLayerGroup className="text-xl text-white" />
          </div>

          <span className="text-2xl font-bold tracking-tight text-white">
            Proxy<span className="text-violet-400">Manager</span>
          </span>
        </Link>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] shadow-2xl shadow-black/20">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

          <div className="p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join ProxyManager to organize and track your proxy requests.
              </p>
            </div>

            {success ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] p-5">
                <FaCheckCircle className="text-3xl text-emerald-300" />

                <h2 className="mt-4 text-lg font-semibold text-white">
                  Account created
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your registration is complete. You can now sign in with
                  your new credentials.
                </p>

                {error && (
                  <p role="alert" className="mt-3 text-sm text-amber-300">
                    {error}
                  </p>
                )}

                <Link
                  href="/login"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500"
                >
                  Go to Login
                  <FaArrowRight />
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-5">
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Username
                    </label>

                    <div className="relative">
                      <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        minLength={3}
                        maxLength={30}
                        required
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        className="w-full rounded-xl border border-white/10 bg-[#080d19]/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    {form.username.trim() && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        {checkingUsername ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500/40 border-t-violet-300" />
                            <span className="text-slate-400">
                              Checking availability...
                            </span>
                          </>
                        ) : usernameAvailable === true ? (
                          <>
                            <FaCheckCircle className="text-emerald-400" />
                            <span className="text-emerald-300">
                              Username is available
                            </span>
                          </>
                        ) : usernameAvailable === false ? (
                          <>
                            <FaTimesCircle className="text-red-400" />
                            <span className="text-red-300">
                              Username is already taken
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500">
                            Availability could not be confirmed. Try again.
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-[#080d19]/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-5">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="w-full rounded-xl border border-white/10 bg-[#080d19]/70 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-3.5 text-sm leading-5 text-red-300"
                    >
                      <FaExclamationCircle className="mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Register */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      googleLoading ||
                      checkingUsername ||
                      usernameAvailable !== true
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Or sign up with
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading || googleLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {googleLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500/40 border-t-white" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </button>

                {/* Login link */}
                <p className="mt-7 text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-violet-300 transition hover:text-violet-200"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-600">
          ProxyManager · Create your account
        </p>
      </div>
    </main>
  );
}