
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import {
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLayerGroup,
} from 'react-icons/fa';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = async () => {
    closeMenu();
    setSigningOut(true);

    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Sign out failed:', error);
      setSigningOut(false);
    }
  };

  const displayName =
    session?.user?.name || session?.user?.email || 'Account';

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.08] bg-[#080d19]/95 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30 transition duration-300 group-hover:scale-105 group-hover:shadow-violet-500/20">
            <FaLayerGroup className="text-lg text-white" />
          </div>

          <div className="min-w-0">
            <span className="block truncate text-lg font-bold tracking-tight text-white sm:text-xl">
              Proxy<span className="text-violet-400">Manager</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
              Campus proxy management
            </span>
          </div>
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {status === 'loading' ? (
            <div
              className="h-9 w-24 animate-pulse rounded-lg bg-white/[0.06]"
              aria-label="Loading account"
            />
          ) : !session ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-white/[0.04] hover:text-white"
              >
                <FaSignInAlt />
                Login
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500"
              >
                <FaUserPlus />
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex max-w-64 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10">
                  <FaUserCircle className="text-lg text-violet-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Signed in as
                  </p>
                  <p
                    title={displayName}
                    className="truncate text-sm font-medium text-slate-200"
                  >
                    {displayName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.07] px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-500/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSignOutAlt />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-violet-400/30 hover:bg-white/[0.07] hover:text-white md:hidden"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="w-full border-t border-white/[0.08] pb-2 pt-4 md:hidden">
            {status === 'loading' ? (
              <p className="px-2 py-3 text-sm text-slate-400">
                Loading account...
              </p>
            ) : !session ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]"
                >
                  <FaSignInAlt />
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <FaUserPlus />
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                    <FaUserCircle className="text-xl text-violet-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="break-all text-sm font-medium text-slate-200">
                      {displayName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/[0.14] disabled:opacity-60"
                >
                  <FaSignOutAlt />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
