'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  // const { data: session } = useSession();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ProxyManager
          </span>
        </Link>

                  {/* Auth Actions */}
                  <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-white">Loading...</div>
            ) : !session ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 transition"
                >
                  <FaSignInAlt />
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 font-medium rounded-lg text-sm px-4 py-2 transition"
                >
                  <FaUserPlus />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-white">
                  <FaUserCircle className="text-xl" />
                  <span>{session.user?.name || session.user?.email}</span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 transition"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </>
            )}
          </div>
      </div>
    </nav>
  );
};

export default Navbar;