
'use client';

import React, { useState } from 'react';
import {
  FaRegSmile,
  FaRegFrown,
  FaRegMeh,
  FaPaperPlane,
  FaCommentDots,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';

const ratings = [
  {
    value: 'positive',
    label: 'Great',
    description: 'Love it!',
    Icon: FaRegSmile,
    color: 'emerald',
  },
  {
    value: 'neutral',
    label: 'Okay',
    description: 'It works',
    Icon: FaRegMeh,
    color: 'amber',
  },
  {
    value: 'negative',
    label: 'Needs work',
    description: 'Could improve',
    Icon: FaRegFrown,
    color: 'rose',
  },
];

const ratingStyles = {
  emerald: {
    icon: 'text-emerald-300',
    selected: 'border-emerald-400/50 bg-emerald-500/[0.10]',
  },
  amber: {
    icon: 'text-amber-300',
    selected: 'border-amber-400/50 bg-amber-500/[0.10]',
  },
  rose: {
    icon: 'text-rose-300',
    selected: 'border-rose-400/50 bg-rose-500/[0.10]',
  },
};

const FeedbackPage = () => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) return;

    // Connect this to the feedback backend later.
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setRating('');
    setMessage('');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[500px] h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl">
        {submitted ? (
          /* Success state */
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] shadow-2xl shadow-black/20">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-violet-500 to-indigo-500" />

            <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
                <FaCheckCircle className="text-4xl text-emerald-300" />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Thank you
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Thanks for your feedback!
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                Your thoughts help us identify what works well and what we
                can improve in ProxyManager.
              </p>

              <button
                type="button"
                onClick={resetForm}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500"
              >
                Send another response
                <FaPaperPlane />
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 shadow-lg shadow-violet-950/20">
                <FaCommentDots className="text-3xl text-violet-300" />
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                Your voice matters
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Share your{' '}
                <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  feedback
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                Tell us about your experience and help make ProxyManager
                better for everyone.
              </p>
            </header>

            {/* Feedback form */}
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] shadow-2xl shadow-black/10"
            >
              <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

              <div className="p-5 sm:p-8">
                {/* Rating */}
                <fieldset>
                  <legend className="text-base font-semibold text-white">
                    How was your experience?
                  </legend>
                  <p className="mt-1 text-sm text-slate-400">
                    Choose the option that best describes it.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {ratings.map(({ value, label, description, Icon, color }) => {
                      const styles = ratingStyles[color];
                      const selected = rating === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setRating(value)}
                          className={`flex min-w-0 flex-col items-center rounded-xl border p-3 text-center transition duration-200 sm:p-5 ${
                            selected
                              ? styles.selected
                              : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <Icon
                            className={`text-2xl sm:text-3xl ${
                              selected ? styles.icon : 'text-slate-400'
                            }`}
                          />

                          <span
                            className={`mt-3 text-sm font-semibold ${
                              selected ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {label}
                          </span>

                          <span className="mt-1 hidden text-xs text-slate-500 sm:block">
                            {description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Message */}
                <div className="mt-8">
                  <label
                    htmlFor="message"
                    className="block text-base font-semibold text-white"
                  >
                    Tell us more
                  </label>

                  <p className="mt-1 text-sm text-slate-400">
                    What did you like, or what could we improve?
                  </p>

                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    maxLength={2000}
                    required
                    placeholder="Share your thoughts, suggestions, or any issues you encountered..."
                    className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-[#080d19]/70 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <div className="mt-2 flex justify-between gap-3 text-xs text-slate-500">
                    <span>Please avoid including sensitive information.</span>
                    <span className="shrink-0 tabular-nums">
                      {message.length}/2000
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!rating || !message.trim()}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  Send Feedback
                  <FaPaperPlane />
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Thanks for helping us improve ProxyManager.
                </p>
              </div>
            </form>

            <p className="mt-5 text-center text-xs text-slate-600">
              Your feedback experience starts here.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default FeedbackPage;
