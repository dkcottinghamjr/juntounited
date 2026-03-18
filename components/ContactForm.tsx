'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-sand bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-terracotta/40 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-sand bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-terracotta/40 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-sand bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-terracotta/40 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-colors resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-white hover:bg-charcoal/90 focus:outline-none focus:ring-2 focus:ring-charcoal/20 disabled:opacity-50 transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'sent' && (
        <p className="text-sm text-green-700">Thanks! We&apos;ll be in touch soon.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
