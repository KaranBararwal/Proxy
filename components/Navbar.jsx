
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLayerGroup,
  FaChevronDown,
  FaUserEdit,
  FaLock,
} from 'react-icons/fa';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const accountRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
  setMounted(true);
}, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setAccountOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

  const accountLinks = [
    {
      href: '/account/username',
      label: 'Change Username',
      description: 'Update your username',
      icon: FaUserEdit,
    },
    {
      href: '/account/password',
      label: 'Change Password',
      description: 'Manage your password',
      icon: FaLock,
    },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.08] bg-[#080d19]/95 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30 transition duration-300 group-hover:scale-105">
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
          {!mounted || status === 'loading' ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-white/[0.06]" />
          ) : !session ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                <FaSignInAlt />
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <FaUserPlus />
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="flex max-w-64 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-left transition hover:border-violet-400/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10">
                    <FaUserCircle className="text-lg text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Signed in as
                    </p>
                    <p title={displayName} className="truncate text-sm font-medium text-slate-200">
                      {displayName}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`shrink-0 text-xs text-slate-500 transition-transform ${
                      accountOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#10182a] p-2 shadow-2xl shadow-black/40"
                  >
                    <div className="border-b border-white/[0.07] px-3 py-3">
                      <p className="text-xs text-slate-500">Your account</p>
                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {session.user.email}
                      </p>
                    </div>

                    {accountLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenu}
                          className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.05]"
                        >
                          <Icon className="text-violet-300" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-300 transition hover:bg-red-500/[0.08] disabled:opacity-50"
                    >
                      <FaSignOutAlt />
                      <span className="text-sm font-medium">
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.07] hover:text-white md:hidden"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="w-full border-t border-white/[0.08] pb-2 pt-4 md:hidden">
            {!mounted || status === 'loading' ? (
              <p className="px-2 py-3 text-sm text-slate-400">
                Loading account...
              </p>
            ) : !session ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.05]"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  <FaUserPlus /> Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <FaUserCircle className="shrink-0 text-2xl text-violet-300" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="break-all text-sm font-medium text-slate-200">
                      {displayName}
                    </p>
                  </div>
                </div>

                {accountLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.05]"
                    >
                      <Icon className="text-violet-300" />
                      {item.label}
                    </Link>
                  );
                })}

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