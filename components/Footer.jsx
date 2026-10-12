
'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaHeart,
  FaGithub,
  FaLinkedin,
  FaLayerGroup,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const internalLinks = [
    { label: 'About', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Feedback', href: '/feedback' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.08] bg-[#080d19] text-slate-400">
      {/* Subtle top accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-10 sm:px-8 sm:pt-12">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/30 transition group-hover:scale-105">
                <FaLayerGroup className="text-lg text-white" />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Proxy<span className="text-violet-400">Manager</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Making campus proxy management simple, organized, and
              transparent.
            </p>

            <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
              Made with <FaHeart className="text-red-400" /> by
              <span className="font-medium text-slate-300">Karan</span>
            </p>
          </div>

          {/* Internal links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Explore
            </h2>

            <ul className="mt-4 space-y-3">
              {internalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-sm transition duration-200 hover:translate-x-1 hover:text-violet-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Connect
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Explore the project or connect with me.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://github.com/KaranBararwal/Proxy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ProxyManager on GitHub"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08] hover:text-white"
              >
                <FaGithub className="text-base" />
                GitHub
                <FaArrowUpRightFromSquare className="text-[10px] text-slate-500" />
              </a>

              <a
                href="https://www.linkedin.com/in/karan-bardwal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Karan on LinkedIn"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/[0.08] hover:text-white"
              >
                <FaLinkedin className="text-base" />
                LinkedIn
                <FaArrowUpRightFromSquare className="text-[10px] text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-9 flex flex-col gap-3 border-t border-white/[0.08] pt-5 text-center sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">
            © {currentYear}{' '}
            <Link
              href="/"
              className="font-medium text-slate-300 transition hover:text-violet-300"
            >
              ProxyManager
            </Link>
            . All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built for campus life <span className="text-violet-400">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;