
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getSession } from 'next-auth/react';

export default function ProxiesMarkedPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchProxies = useCallback(async () => {
    try {
      setError('');

      const res = await fetch('/api/proxies/by-you', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch proxies');
      }

      setProxies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while fetching proxies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        const session = await getSession();

        if (!isActive) return;

        if (!session) {
          setError('You are not authenticated. Please log in again.');
          setLoading(false);
          return;
        }

        await fetchProxies();
      } catch (err) {
        if (!isActive) return;

        console.error('Session check failed:', err);
        setError('Unable to verify your session.');
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, [fetchProxies]);

  const handleDelete = async (id) => {
    if (deletingIds.includes(id)) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this proxy request?'
    );

    if (!confirmed) return;

    setDeletingIds((prev) => [...prev, id]);

    try {
      const res = await fetch(`/api/proxies/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete proxy');
      }

      setProxies((prev) => prev.filter((proxy) => proxy._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.message || 'Failed to delete proxy');
    } finally {
      setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';
      case 'rejected':
        return 'border-red-400/20 bg-red-400/10 text-red-300';
      case 'pending':
      default:
        return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
    }
  };

  const getStatusDot = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-emerald-400';
      case 'rejected':
        return 'bg-red-400';
      default:
        return 'bg-amber-400';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 pb-16 pt-24 text-white md:px-8">
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-violet-600/[0.09] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-96 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Proxy management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Proxies You've Marked
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Track the requests you've sent, check their status, and manage
            your proxy activity.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={fetchProxies}
              className="w-fit rounded-lg border border-red-400/20 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/10"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#101729]/80 p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-white/10 border-t-violet-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading your proxy requests...
            </p>
          </div>
        ) : proxies.length === 0 && !error ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#101729]/60 px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl text-violet-200">
              ◈
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Nothing here yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              When you mark a proxy for someone, your requests will appear
              here so you can track their progress.
            </p>
          </div>
        ) : (
          <>
            {/* Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Your requests
                <span className="ml-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white">
                  {proxies.length}
                </span>
              </p>
            </div>

            {/* Proxy cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {proxies.map((proxy) => {
                const isDeleting = deletingIds.includes(proxy._id);

                return (
                  <article
                    key={proxy._id}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-xl hover:shadow-violet-950/20 sm:p-6"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-60 transition group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-xl text-violet-200">
                          ◈
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Subject
                          </p>

                          <h2 className="mt-1 break-words text-lg font-semibold text-white">
                            {proxy.subject}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          proxy.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            proxy.status
                          )}`}
                        />
                        {formatStatus(proxy.status)}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                        <p className="text-xs text-slate-500">Marked for</p>
                        <p className="mt-1 break-words text-sm font-medium text-slate-200">
                          {proxy.markedFor}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                        <p className="text-xs text-slate-500">Class date</p>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {proxy.date}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                      <p className="text-xs text-slate-500">
                        {proxy.status?.toLowerCase() === 'accepted'
                          ? 'Your request was accepted.'
                          : proxy.status?.toLowerCase() === 'rejected'
                            ? 'Your request was rejected.'
                            : 'Waiting for the recipient to respond.'}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleDelete(proxy._id)}
                        disabled={isDeleting}
                        className="shrink-0 rounded-xl border border-red-400/20 bg-red-500/[0.07] px-3 py-2 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
          <p className="text-xs text-slate-500">
            ProxyManager <span className="mx-1">·</span> Request history
          </p>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Your activity
          </p>
        </div>
      </div>
    </main>
  );
}
