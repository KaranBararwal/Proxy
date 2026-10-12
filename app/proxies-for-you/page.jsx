
'use client';

import React, { useEffect, useState, useCallback } from 'react';

export default function ProxiesForYouPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);

  const fetchProxies = useCallback(async () => {
    try {
      const res = await fetch('/api/proxies/for-you', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch proxies');
      }

      const data = await res.json();
      setProxies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching proxies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    let timeoutId;

    const pollProxies = async () => {
      try {
        const res = await fetch('/api/proxies/for-you', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch proxies');
        }

        const data = await res.json();

        if (isActive) {
          setProxies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isActive) {
          console.error('Error fetching proxies:', err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
          timeoutId = setTimeout(pollProxies, 5000);
        }
      }
    };

    pollProxies();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleAction = async (id, newStatus) => {
    if (processingIds.includes(id)) return;

    setProcessingIds((prev) => [...prev, id]);

    try {
      const res = await fetch(`/api/proxies/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          `Failed to update: ${
            data.error || 'Please refresh and try again.'
          }`
        );

        await fetchProxies();
        return;
      }

      await fetchProxies();
    } catch (err) {
      console.error('Error updating proxy status:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setProcessingIds((prev) =>
        prev.filter((itemId) => itemId !== id)
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';
      case 'rejected':
        return 'border-red-400/20 bg-red-400/10 text-red-300';
      default:
        return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-400';
      case 'rejected':
        return 'bg-red-400';
      default:
        return 'bg-amber-400';
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 pb-16 pt-24 text-white md:px-8">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-violet-600/[0.09] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-96 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Proxy management
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Proxies Marked for You
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Review incoming requests and decide which ones to accept.
                Your request statuses update automatically.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Auto-refresh enabled
            </div>
          </div>
        </div>

        {/* Request list */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#101729]/80 p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-white/10 border-t-violet-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading your proxy requests...
            </p>
          </div>
        ) : proxies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#101729]/60 px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl">
              ✦
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">
              All caught up
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              You don't have any proxy requests yet. New requests will
              appear here automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Your requests
                <span className="ml-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white">
                  {proxies.length}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Updates every 5 seconds
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {proxies.map((item) => {
                const isProcessing = processingIds.includes(item._id);

                return (
                  <article
                    key={item._id}
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
                            {item.subject}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            item.status
                          )}`}
                        />
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                        <p className="text-xs text-slate-500">
                          Marked by
                        </p>
                        <p className="mt-1 break-all text-sm font-medium text-slate-200">
                          {item.markedBy}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                        <p className="text-xs text-slate-500">
                          Class date
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {item.date}
                        </p>
                      </div>
                    </div>

                    {item.status === 'pending' ? (
                      <div className="mt-5 border-t border-white/[0.07] pt-5">
                        <p className="mb-3 text-xs text-slate-400">
                          Choose how to respond to this request
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(item._id, 'accepted')
                            }
                            disabled={isProcessing}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? 'Processing...' : '✓ Accept'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(item._id, 'rejected')
                            }
                            disabled={isProcessing}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm font-semibold text-red-300 transition duration-200 hover:border-red-400/40 hover:bg-red-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing ? 'Processing...' : '✕ Reject'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 border-t border-white/[0.07] pt-4">
                        <p className="text-xs text-slate-500">
                          {item.status === 'accepted'
                            ? 'This proxy request has been accepted.'
                            : 'This proxy request has been rejected.'}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
          <p className="text-xs text-slate-500">
            ProxyManager <span className="mx-1">·</span> Request center
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Status sync active
          </p>
        </div>
      </div>
    </main>
  );
}