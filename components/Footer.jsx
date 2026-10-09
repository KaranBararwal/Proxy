'use client';

import React from 'react';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow-sm md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
        © {currentYear}{' '}
        <a href="/" className="hover:underline font-medium">
          Proxy
        </a>
        . Made with <FaHeart className="text-red-500 inline" /> by Karan
      </span>

      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <a
            href="/about"
            className="hover:underline me-4 md:me-6"
          >
            About
          </a>
        </li>

        <li>
          <a
            href="/how-it-works"
            className="hover:underline me-4 md:me-6"
          >
            How It Works
          </a>
        </li>

        <li>
          <a
            href="/feedback"
            className="hover:underline me-4 md:me-6"
          >
            Feedback
          </a>
        </li>

        <li>
          <a
            href="https://github.com/KaranBararwal/Proxy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline me-4 md:me-6 flex items-center gap-1"
          >
            <FaGithub />
            GitHub
          </a>
        </li>

        <li>
          <a
            href="https://www.linkedin.com/in/karan-bardwal/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <FaLinkedin />
            LinkedIn
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;