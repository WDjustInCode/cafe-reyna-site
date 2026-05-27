'use client';

import { useState } from 'react';

const NAME_PATTERN = /^[A-Za-zÀ-ÿ'\- ]{1,50}$/;

const inputClass =
  'w-full rounded-full border border-[#cdbda7] bg-white px-5 py-3 text-sm text-[#2a2a2a] outline-none placeholder:text-[#a89988] focus:border-[#6b3e26] focus:ring-1 focus:ring-[#6b3e26]';

export function SubscribeSection() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <section
      id="stay-in-the-loop"
      aria-label="Subscribe for launch updates"
      className="space-y-6 rounded-3xl border border-[#e3d7c5] bg-[#efe5d8] px-6 py-12 text-center"
    >
      {status === 'success' ? (
        <div className="space-y-2">
          <p className="text-2xl">☕</p>
          <h2 className="text-2xl font-semibold text-[#6a4322]">You&apos;re on the list</h2>
          <p className="text-sm leading-relaxed text-[#4a4037]">
            We&apos;ll be in touch with launch news, fresh batches, and stories from the farm.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a6a5a]">
              Stay in the loop
            </p>
            <h2 className="text-2xl font-semibold text-[#6a4322]">
              We&apos;re launching soon
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#4a4037]">
              Get notified when our first roast batches go live — plus farm stories and early access to new lots.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-3">
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
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-full bg-[#6b3e26] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#56311f] disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing…' : 'Notify me'}
            </button>
          </form>

          {status === 'error' && (
            <p className="text-xs text-red-600">{errorMsg}</p>
          )}

          <p className="text-xs text-[#7a6a5a]">No spam. Unsubscribe anytime.</p>
        </>
      )}
    </section>
  );
}
