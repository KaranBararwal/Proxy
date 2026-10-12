
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ProxyCard = ({
  proxiesGiven,
  proxiesReceived,
  loading,
  error,
}) => {
  const router = useRouter();

  const summaryItems = [
    {
      title: "Proxies You've Marked",
      description: 'Requests you have sent to classmates',
      count: proxiesGiven,
      href: '/proxies-marked',
      icon: '↗',
      gradient: 'from-violet-500 to-indigo-500',
      glow: 'group-hover:shadow-violet-500/10',
      iconBg: 'bg-violet-500/15 text-violet-300',
      countColor: 'text-violet-200',
    },
    {
      title: 'Proxies Marked for You',
      description: 'Requests waiting for your attention',
      count: proxiesReceived,
      href: '/proxies-for-you',
      icon: '↓',
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'group-hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-300',
      countColor: 'text-cyan-200',
    },
  ];

  return (
    <section className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-5 shadow-2xl shadow-black/20 sm:p-8">
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="relative">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Your workspace
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Proxy Summary
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your proxy activity, all in one place.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
            <span className="text-base">✦</span>
            Live overview
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <span className="mr-2">⚠</span>
            Failed to load proxy counts. Please try again.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {summaryItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#151d32] to-[#101729] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl ${item.glow} focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1020] sm:p-6`}
            >
              {/* Card accent */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${item.gradient} opacity-70 transition-opacity group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition duration-300 group-hover:scale-110 ${item.iconBg}`}
                >
                  {item.icon}
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-lg text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white">
                  ↗
                </span>
              </div>

              <div className="mt-7">
                <p className="text-sm font-medium text-slate-300">
                  {item.title}
                </p>

                <div className="mt-2 flex min-h-12 items-center">
                  {loading ? (
                    <div
                      role="status"
                      aria-label="Loading count"
                      className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/10 border-t-violet-400"
                    />
                  ) : (
                    <span
                      className={`text-4xl font-bold tracking-tight tabular-nums sm:text-5xl ${item.countColor}`}
                    >
                      {item.count ?? 0}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors group-hover:text-white">
                View details
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
          <p className="text-xs text-slate-500">
            ProxyManager <span className="mx-1">·</span> Dashboard
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ready to go
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProxyCard;