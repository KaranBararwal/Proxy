'use client';

import React, { useState } from 'react';
import { FaRegSmile, FaRegFrown, FaRegMeh } from 'react-icons/fa';

const FeedbackPage = () => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) {
      return;
    }

    // We'll connect this to the backend later.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-28">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
            <div className="text-5xl mb-5">🎉</div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Thanks for your feedback!
            </h1>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Your feedback helps make Proxy better.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setRating('');
                setMessage('');
              }}
              className="px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-700 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition"
            >
              Send another response
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-28">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Feedback
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Help us improve Proxy.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-7 md:p-10"
        >
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
              How was your experience?
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRating('positive')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  rating === 'positive'
                    ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
              >
                <FaRegSmile className="text-2xl text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Great
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRating('neutral')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  rating === 'neutral'
                    ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
              >
                <FaRegMeh className="text-2xl text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Okay
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRating('negative')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  rating === 'negative'
                    ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
              >
                <FaRegFrown className="text-2xl text-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Needs work
                </span>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Tell us more
            </label>

            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="What do you like? What could be improved?"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!rating || !message.trim()}
            className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:disabled:bg-gray-600"
          >
            Send Feedback
          </button>
        </form>
      </div>
    </main>
  );
};

export default FeedbackPage;
