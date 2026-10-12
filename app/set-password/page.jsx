
'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaShieldAlt,
  FaArrowLeft,
} from 'react-icons/fa';

const SetPasswordPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (
      status === 'authenticated' &&
      session?.user?.hasPassword
    ) {
      router.replace('/');
    }
  }, [status, session?.user?.hasPassword, router]);

  useEffect(() => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }

    const controller = new AbortController();

    const debounce = setTimeout(async () => {
      setCheckingUsername(true);

      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(trimmedUsername)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setUsernameAvailable(null);
          return;
        }

        const data = await res.json();
        setUsernameAvailable(data.available === true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setUsernameAvailable(null);
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
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (usernameAvailable !== true) {
      setError(
        checkingUsername
          ? 'Please wait while we check your username'
          : 'Please choose an available username'
      );
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          username: trimmedUsername,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to set your password');
      }

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: session?.user?.email,
        password,
      });

      if (signInResult?.error) {
        router.replace('/login?passwordSet=true');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (
    status === 'loading' ||
    status === 'unauthenticated' ||
    session?.user?.hasPassword
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d19]">
        <FaSpinner className="animate-spin text-2xl text-violet-400" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d19] px-4 py-12 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-[110px]" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <FaArrowLeft className="text-xs" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-white/[0.09] bg-[#10182a]/95 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
            <FaShieldAlt className="text-2xl text-violet-300" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Account security
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Set your password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Create a username and password so you can sign in to ProxyManager
            with your credentials.
          </p>

          {session?.user?.email && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#080d19]/70 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                <FaUser />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="truncate text-sm text-slate-200">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Username
              </label>

              <div className="relative">
                <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500" />
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <FaSpinner className="animate-spin text-sm text-slate-400" />
                  ) : usernameAvailable === true ? (
                    <FaCheckCircle className="text-sm text-emerald-400" />
                  ) : usernameAvailable === false ? (
                    <FaTimesCircle className="text-sm text-red-400" />
                  ) : null}
                </span>
              </div>

              <div className="mt-2 min-h-5 text-xs">
                {checkingUsername ? (
                  <p className="text-slate-500">Checking availability...</p>
                ) : usernameAvailable === true ? (
                  <p className="flex items-center gap-1.5 text-emerald-400">
                    <FaCheckCircle />
                    Username is available
                  </p>
                ) : usernameAvailable === false ? (
                  <p className="flex items-center gap-1.5 text-red-400">
                    <FaTimesCircle />
                    Username is already taken
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Use at least 3 characters
                  </p>
                )}
              </div>
            </div>

            {/* New password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                New password
              </label>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className={`mt-2 flex items-center gap-1.5 text-xs ${
                    password === confirmPassword
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <FaCheckCircle />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <FaTimesCircle />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                checkingUsername ||
                usernameAvailable !== true
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Setting password...
                </>
              ) : (
                <>
                  <FaLock />
                  Set password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 border-t border-white/[0.07] pt-5 text-xs leading-5 text-slate-500">
            <FaShieldAlt className="mt-0.5 shrink-0 text-violet-400" />
            Your password will be used for future credential-based sign-ins.
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          ProxyManager · Secure access to your account
        </p>
      </div>
    </main>
  );
};

export default SetPasswordPage;