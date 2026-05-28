'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cafe-reyna-subscribed';
const NAME_PATTERN = /^[A-Za-zÀ-ÿ'\- ]{1,50}$/;

const inputClass =
  'w-full rounded-full border border-[#cdbda7] bg-white px-5 py-3 text-sm text-[#2a2a2a] outline-none placeholder:text-[#a89988] focus:border-[#6b3e26] focus:ring-1 focus:ring-[#6b3e26]';

export function SubscribePopup() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setMounted(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
    setTimeout(() => setMounted(false), 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const first = firstName.trim();
    const last = lastName.trim();

    if (!NAME_PATTERN.test(first)) {
      setErrorMsg('Please enter a valid first name.');
      setStatus('error');
      return;
    }
    if (!NAME_PATTERN.test(last)) {
      setErrorMsg('Please enter a valid last name.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: first, lastName: last, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('success');
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={dismiss}
        aria-hidden="true"
      />
      <div className={`relative w-full max-w-md rounded-2xl border border-[#e3d7c5] bg-[#f4ede4] px-8 py-10 shadow-2xl transition-all duration-300 ease-out ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'}`}>
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] transition hover:bg-[#e3d7c5] hover:text-[#2a2a2a]"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="space-y-3 text-center">
            <p className="text-2xl">☕</p>
            <h2 className="text-3xl font-semibold text-[#6a4322]">You&apos;re on the list</h2>
            <p className="text-sm leading-relaxed text-[#4a4037]">
              We&apos;ll reach out as soon as we launch. Expect fresh batches, farm stories, and early access.
            </p>
            <button
              onClick={dismiss}
              className="mt-4 rounded-full bg-[#6b3e26] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#56311f]"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
                Coming Soon
              </p>
              <h2 className="text-4xl font-semibold text-[#6a4322]">
                Be first to know
              </h2>
              <p className="text-sm leading-relaxed text-[#4a4037]">
                Café Reyna is launching soon. Drop your email and we&apos;ll notify you the moment fresh roast batches go live.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={inputClass}
              />
              {status === 'error' && (
                <p className="px-1 text-xs text-red-600">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full bg-[#6b3e26] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#56311f] disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing…' : 'Notify me at launch'}
              </button>
            </form>

            <p className="text-center text-xs text-[#7a6a5a]">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
