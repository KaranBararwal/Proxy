
import React from 'react';
import {
  FaLayerGroup,
  FaPaperPlane,
  FaCheckCircle,
  FaChartLine,
  FaBookOpen,
  FaCode,
  FaArrowRight,
} from 'react-icons/fa';
import Link from 'next/link';

const features = [
  {
    icon: FaPaperPlane,
    title: 'Create Proxy Requests',
    description:
      'Choose a subject, date, and student to create and manage proxy requests in one place.',
    accent: 'violet',
  },
  {
    icon: FaCheckCircle,
    title: 'Accept or Reject',
    description:
      'Review incoming requests and respond with a clear, trackable status.',
    accent: 'emerald',
  },
  {
    icon: FaChartLine,
    title: 'Track Your Proxies',
    description:
      'Keep track of requests you have marked and requests marked for you.',
    accent: 'blue',
  },
  {
    icon: FaBookOpen,
    title: 'Manage Subjects',
    description:
      'Organize subjects by course and semester for easier proxy management.',
    accent: 'amber',
  },
];

const technologies = [
  'Next.js',
  'React',
  'MongoDB',
  'Mongoose',
  'NextAuth',
  'Tailwind CSS',
];

const accentStyles = {
  violet: {
    icon: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
    glow: 'group-hover:border-violet-400/30',
  },
  emerald: {
    icon: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    glow: 'group-hover:border-emerald-400/30',
  },
  blue: {
    icon: 'border-blue-400/20 bg-blue-500/10 text-blue-300',
    glow: 'group-hover:border-blue-400/30',
  },
  amber: {
    icon: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
    glow: 'group-hover:border-amber-400/30',
  },
};

const AboutPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[500px] h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 shadow-lg shadow-violet-950/20">
            <FaLayerGroup className="text-3xl text-violet-300" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            About the platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Meet{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              ProxyManager
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            A centralized platform designed to make student proxy request
            management simpler, more organized, and easier to track.
          </p>
        </section>

        {/* About description */}
        <section className="mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32]/95 to-[#0e1526]/95 p-6 shadow-xl shadow-black/10 sm:p-9">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <FaLayerGroup className="text-lg text-violet-300" />
            </div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Why ProxyManager?
            </h2>
          </div>

          <p className="leading-7 text-slate-300">
            Instead of coordinating proxy requests through messages or keeping
            track of them manually, ProxyManager provides one place where
            students can create, receive, accept, reject, and track their
            requests.
          </p>

          <p className="mt-4 leading-7 text-slate-400">
            The goal is to make the process clearer for both students involved,
            with organized request details and visible statuses throughout the
            workflow.
          </p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              What you can do
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Everything in one place
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              The essential tools to manage and follow your proxy requests.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const styles = accentStyles[feature.accent];

              return (
                <article
                  key={feature.title}
                  className={`group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 ${styles.glow}`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${styles.icon}`}
                  >
                    <Icon className="text-xl" />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-10 rounded-2xl border border-white/[0.08] bg-[#101729]/80 p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
              <FaCode className="text-lg text-indigo-300" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Built With
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                The technologies powering the platform.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/[0.07] hover:text-violet-200"
              >
                {technology}
              </span>
            ))}
          </div>
        </section>

        {/* Closing section */}
        <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-600/[0.14] via-indigo-600/[0.10] to-blue-600/[0.08] p-6 sm:p-8">
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Ready to get started?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Head back to ProxyManager to manage your requests and check
                their status.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500"
            >
              Go to Dashboard
              <FaArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
