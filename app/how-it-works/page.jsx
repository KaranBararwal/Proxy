
import React from 'react';
import Link from 'next/link';
import {
  FaSignInAlt,
  FaClipboardList,
  FaPaperPlane,
  FaCheckCircle,
  FaHistory,
  FaArrowRight,
  FaLayerGroup,
} from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: FaSignInAlt,
    title: 'Sign In',
    description:
      'Sign in to ProxyManager using your email and password or continue with Google.',
    accent: 'violet',
  },
  {
    number: '02',
    icon: FaClipboardList,
    title: 'Choose the Details',
    description:
      'Select the course, semester, subject, date, and the student who will receive the proxy.',
    accent: 'blue',
  },
  {
    number: '03',
    icon: FaPaperPlane,
    title: 'Send the Proxy',
    description:
      'Submit your request. The selected student can find it in their incoming proxies.',
    accent: 'indigo',
  },
  {
    number: '04',
    icon: FaCheckCircle,
    title: 'Accept or Reject',
    description:
      'The receiving student reviews the request and decides whether to accept or reject it.',
    accent: 'emerald',
  },
  {
    number: '05',
    icon: FaHistory,
    title: 'Track Your Proxies',
    description:
      'Check the status of requests you have marked and requests marked for you.',
    accent: 'amber',
  },
];

const accentStyles = {
  violet: {
    icon: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
    line: 'from-violet-500/60',
  },
  blue: {
    icon: 'border-blue-400/20 bg-blue-500/10 text-blue-300',
    line: 'from-blue-500/60',
  },
  indigo: {
    icon: 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300',
    line: 'from-indigo-500/60',
  },
  emerald: {
    icon: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    line: 'from-emerald-500/60',
  },
  amber: {
    icon: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
    line: 'from-amber-500/60',
  },
};

const StepCard = ({ step, index }) => {
  const Icon = step.icon;
  const styles = accentStyles[step.accent];
  const isLeft = index % 2 === 0;

  return (
    <article
      className={`group relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-xl hover:shadow-violet-950/10 sm:p-7 ${
        isLeft ? 'md:text-right' : 'md:text-left'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${styles.line} to-transparent opacity-50 transition group-hover:opacity-100 ${
          isLeft ? 'md:bg-gradient-to-l' : ''
        }`}
      />

      <div
        className={`flex items-center gap-4 ${
          isLeft ? 'md:flex-row-reverse' : ''
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          <Icon className="text-xl" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Step {step.number}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            {step.title}
          </h2>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
        {step.description}
      </p>
    </article>
  );
};

const HowItWorksPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[550px] h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-14 text-center sm:mb-20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 shadow-lg shadow-violet-950/20">
            <FaLayerGroup className="text-3xl text-violet-300" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            Simple by design
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              ProxyManager
            </span>{' '}
            Works
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            From creating a request to tracking its outcome, manage your proxy
            workflow in five simple steps.
          </p>
        </header>

        {/* Timeline */}
        <section aria-label="Five steps to manage a proxy request">
          <div className="relative">
            {/* Desktop timeline */}
            <div
              aria-hidden="true"
              className="absolute bottom-12 left-1/2 top-12 hidden w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-indigo-500/30 to-amber-500/30 md:block"
            />

            <div className="space-y-5 md:space-y-10">
              {steps.map((step, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={step.number}
                    className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-0"
                  >
                    {/* Left card */}
                    <div
                      className={
                        isLeft
                          ? 'md:pr-14 lg:pr-20'
                          : 'md:col-start-2 md:pl-14 lg:pl-20'
                      }
                    >
                      {isLeft && <StepCard step={step} index={index} />}
                    </div>

                    {/* Timeline number */}
                    <div className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#080d19] bg-[#182039] shadow-lg shadow-black/20 md:flex">
                      <span className="text-xs font-bold text-violet-200">
                        {step.number}
                      </span>
                    </div>

                    {/* Right card */}
                    <div
                      className={
                        !isLeft
                          ? 'md:col-start-2 md:pl-14 lg:pl-20'
                          : 'md:col-start-2 md:pl-14 lg:pl-20'
                      }
                    >
                      {!isLeft && <StepCard step={step} index={index} />}
                    </div>

                    {/* Mobile number */}
                    <div className="absolute -left-1 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/20 bg-[#182039] text-[10px] font-bold text-violet-200 md:hidden">
                      {step.number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing section */}
        <section className="relative mt-16 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-600/[0.14] via-indigo-600/[0.10] to-blue-600/[0.08] p-6 text-center sm:mt-20 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
            <FaCheckCircle className="text-2xl text-emerald-300" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            That's it. You're ready.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Keep your proxy requests organized, follow their status, and
            manage your activity from one place.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500"
          >
            Go to Dashboard
            <FaArrowRight />
          </Link>
        </section>
      </div>
    </main>
  );
};

export default HowItWorksPage;