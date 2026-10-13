
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const suggestedPrompts = [
  'Summarize my proxy requests',
  'How many proxies are pending?',
  'Show my rejected proxies',
];

export default function ProxyAIAssistant() {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hey! I'm your Proxy Assistant. Ask me about your proxy requests, statuses, or pending approvals.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status !== 'authenticated') return null;

  const sendMessage = async (text = input) => {
    const message = text.trim();

    if (!message || loading) return;

    setInput('');
    setError('');
    setMessages((previous) => [
      ...previous,
      { role: 'user', content: message },
    ]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to contact the assistant.');
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: data.answer || 'I could not generate an answer.',
        },
      ]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Proxy AI Assistant"
          className="fixed bottom-6 right-5 z-[100] flex items-center gap-3 rounded-full border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-950/50 transition hover:-translate-y-1 hover:shadow-violet-500/20 sm:bottom-7 sm:right-7"
        >
          <span className="text-xl">✦</span>
          <span>Ask Proxy AI</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <section
          aria-label="Proxy AI chat"
          className="fixed bottom-4 right-3 z-[100] flex h-[min(620px,calc(100dvh-32px))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/60 sm:bottom-7 sm:right-7"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-indigo-600/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/15 text-xl text-violet-200">
                ✦
              </div>
              <div>
                <h2 className="font-semibold text-white">Proxy AI</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Your personal proxy assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </header>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto p-4"
            aria-live="polite"
          >
            <div className="rounded-2xl rounded-tl-md border border-violet-400/10 bg-[#141d32] px-4 py-3 text-sm leading-relaxed text-slate-200">
              Ask about your requests or try one of these:
            </div>

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    item.role === 'user'
                      ? 'rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                      : 'rounded-bl-md border border-white/[0.06] bg-[#141d32] text-slate-200'
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-xl border border-violet-400/20 bg-violet-500/[0.07] px-3 py-2 text-left text-xs text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/15"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-[#141d32] px-4 py-3 text-sm text-slate-400">
                  Thinking
                  <span className="ml-2 inline-block animate-pulse text-violet-300">
                    •••
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
                <button
                  type="button"
                  onClick={() => sendMessage(messages.at(-1)?.content || '')}
                  className="ml-2 underline underline-offset-2"
                  disabled={loading}
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-white/10 bg-[#0e1526] p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#080d19] p-2 transition focus-within:border-violet-400/50">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about your proxies..."
                aria-label="Message Proxy AI"
                rows={1}
                maxLength={1000}
                className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-lg text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↑
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] text-slate-500">
              AI can make mistakes. Verify important information.
            </p>
          </form>
        </section>
      )}
    </>
  );
}