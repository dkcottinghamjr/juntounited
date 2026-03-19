'use client'

import { useState, useEffect, FormEvent } from 'react'

// ── Types ──

type InfluencerItem = { name: string; description: string; link: string }
type InfluencerData = { individuals: InfluencerItem[]; companies: InfluencerItem[]; content: InfluencerItem[] }
type InfluencerCategory = keyof InfluencerData

type Project = { slug: string; name: string; description: string; status: string; cta: string; ctaLink: string }

type Conversation = { slug: string; title: string; date: string; excerpt: string; content: string }

// ── Shared styles ──

const inputClass = 'w-full rounded-lg border border-sand bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-terracotta/40 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-colors'
const btnPrimary = 'inline-flex items-center gap-2 rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-white hover:bg-charcoal/90 disabled:opacity-50 transition-colors'
const btnSmall = 'rounded-md bg-charcoal px-4 py-1.5 text-xs font-semibold text-white hover:bg-charcoal/90 disabled:opacity-50 transition-colors'
const btnCancel = 'rounded-md border border-sand px-4 py-1.5 text-xs font-medium text-charcoal/60 hover:text-charcoal transition-colors'
const actionLink = 'text-xs transition-colors ml-2 flex-shrink-0'

function ArrowUp() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function ReorderButtons({ index, total, onMove }: { index: number; total: number; onMove: (from: number, to: number) => void }) {
  return (
    <div className="flex flex-col mr-3 flex-shrink-0">
      <button onClick={() => onMove(index, index - 1)} disabled={index === 0} className="text-charcoal/20 hover:text-charcoal disabled:opacity-20 disabled:cursor-not-allowed transition-colors" aria-label="Move up">
        <ArrowUp />
      </button>
      <button onClick={() => onMove(index, index + 1)} disabled={index === total - 1} className="text-charcoal/20 hover:text-charcoal disabled:opacity-20 disabled:cursor-not-allowed transition-colors" aria-label="Move down">
        <ArrowDown />
      </button>
    </div>
  )
}

function StatusBadge({ text }: { text: string }) {
  return <span className="ml-2 text-xs text-charcoal/30 italic">{text}</span>
}

// ════════════════════════════════════════════════
// Main admin page
// ════════════════════════════════════════════════

const influencerCategories: { key: InfluencerCategory; label: string }[] = [
  { key: 'individuals', label: 'Individuals' },
  { key: 'companies', label: 'Companies' },
  { key: 'content', label: 'Content' },
]

const projectStatuses = ['Active', 'In Development', 'Coming Soon']

export default function AdminPage() {
  // ── Influencer state ──
  const [influencers, setInfluencers] = useState<InfluencerData | null>(null)
  const [infAddStatus, setInfAddStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [infEditing, setInfEditing] = useState<{ category: InfluencerCategory; index: number; name: string; description: string; link: string } | null>(null)
  const [infEditStatus, setInfEditStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  // ── Project state ──
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [projAddStatus, setProjAddStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [projEditing, setProjEditing] = useState<{ index: number; name: string; description: string; status: string; cta: string; ctaLink: string } | null>(null)
  const [projEditStatus, setProjEditStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  // ── Conversation state ──
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [convAddStatus, setConvAddStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [convEditing, setConvEditing] = useState<Conversation | null>(null)
  const [convEditStatus, setConvEditStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/influencers').then((r) => r.json()).then(setInfluencers)
    fetch('/api/projects').then((r) => r.json()).then(setProjects)
    fetch('/api/conversations').then((r) => r.json()).then(setConversations)
  }, [])

  // ════════════════════════════════════════
  // Influencer handlers
  // ════════════════════════════════════════

  async function handleInfAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInfAddStatus('saving')
    const form = e.currentTarget
    const payload = {
      name: (form.elements.namedItem('inf-name') as HTMLInputElement).value,
      description: (form.elements.namedItem('inf-description') as HTMLInputElement).value,
      link: (form.elements.namedItem('inf-link') as HTMLInputElement).value,
      category: (form.elements.namedItem('inf-category') as HTMLSelectElement).value,
    }
    try {
      const res = await fetch('/api/influencers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      setInfluencers((await res.json()).data)
      setInfAddStatus('saved')
      form.reset()
      setTimeout(() => setInfAddStatus('idle'), 2000)
    } catch { setInfAddStatus('error') }
  }

  async function handleInfDelete(name: string, category: string) {
    const res = await fetch('/api/influencers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, category }) })
    if (res.ok) { setInfluencers((await res.json()).data); if (infEditing?.name === name) setInfEditing(null) }
  }

  async function handleInfMove(category: InfluencerCategory, fromIndex: number, toIndex: number) {
    const res = await fetch('/api/influencers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, fromIndex, toIndex }) })
    if (res.ok) {
      setInfluencers((await res.json()).data)
      if (infEditing?.category === category && infEditing.index === fromIndex) setInfEditing({ ...infEditing, index: toIndex })
    }
  }

  async function saveInfEdit() {
    if (!infEditing) return
    setInfEditStatus('saving')
    try {
      const res = await fetch('/api/influencers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(infEditing) })
      if (!res.ok) throw new Error()
      setInfluencers((await res.json()).data)
      setInfEditing(null)
      setInfEditStatus('idle')
    } catch { setInfEditStatus('error') }
  }

  // ════════════════════════════════════════
  // Project handlers
  // ════════════════════════════════════════

  async function handleProjAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProjAddStatus('saving')
    const form = e.currentTarget
    const payload = {
      name: (form.elements.namedItem('proj-name') as HTMLInputElement).value,
      description: (form.elements.namedItem('proj-description') as HTMLTextAreaElement).value,
      status: (form.elements.namedItem('proj-status') as HTMLSelectElement).value,
      cta: (form.elements.namedItem('proj-cta') as HTMLInputElement).value,
      ctaLink: (form.elements.namedItem('proj-ctaLink') as HTMLInputElement).value,
    }
    try {
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      setProjects((await res.json()).data)
      setProjAddStatus('saved')
      form.reset()
      setTimeout(() => setProjAddStatus('idle'), 2000)
    } catch { setProjAddStatus('error') }
  }

  async function handleProjDelete(index: number) {
    const res = await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index }) })
    if (res.ok) { setProjects((await res.json()).data); if (projEditing?.index === index) setProjEditing(null) }
  }

  async function handleProjMove(fromIndex: number, toIndex: number) {
    const res = await fetch('/api/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromIndex, toIndex }) })
    if (res.ok) {
      setProjects((await res.json()).data)
      if (projEditing?.index === fromIndex) setProjEditing({ ...projEditing, index: toIndex })
    }
  }

  async function saveProjEdit() {
    if (!projEditing) return
    setProjEditStatus('saving')
    try {
      const res = await fetch('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projEditing) })
      if (!res.ok) throw new Error()
      setProjects((await res.json()).data)
      setProjEditing(null)
      setProjEditStatus('idle')
    } catch { setProjEditStatus('error') }
  }

  // ════════════════════════════════════════
  // Conversation handlers
  // ════════════════════════════════════════

  async function handleConvAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setConvAddStatus('saving')
    const form = e.currentTarget
    const payload = {
      title: (form.elements.namedItem('conv-title') as HTMLInputElement).value,
      date: (form.elements.namedItem('conv-date') as HTMLInputElement).value,
      excerpt: (form.elements.namedItem('conv-excerpt') as HTMLTextAreaElement).value,
      content: (form.elements.namedItem('conv-content') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      setConversations((await res.json()).data)
      setConvAddStatus('saved')
      form.reset()
      setTimeout(() => setConvAddStatus('idle'), 2000)
    } catch { setConvAddStatus('error') }
  }

  async function handleConvDelete(slug: string) {
    const res = await fetch('/api/conversations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
    if (res.ok) { setConversations((await res.json()).data); if (convEditing?.slug === slug) setConvEditing(null) }
  }

  async function saveConvEdit() {
    if (!convEditing) return
    setConvEditStatus('saving')
    try {
      const res = await fetch('/api/conversations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalSlug: convEditing.slug, title: convEditing.title, date: convEditing.date, excerpt: convEditing.excerpt, content: convEditing.content }),
      })
      if (!res.ok) throw new Error()
      setConversations((await res.json()).data)
      setConvEditing(null)
      setConvEditStatus('idle')
    } catch { setConvEditStatus('error') }
  }

  // ════════════════════════════════════════
  // Render
  // ════════════════════════════════════════

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-4">Admin</p>
      <h1 className="font-display text-4xl font-semibold text-charcoal mb-2">Manage content</h1>
      <p className="text-charcoal/40 text-sm mb-12">Changes are saved to the data files. Redeploy to publish.</p>

      {/* ════════════════════════════════════════ */}
      {/* INFLUENCERS */}
      {/* ════════════════════════════════════════ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold text-charcoal mb-6 border-b border-sand pb-3">Influencers</h2>

        {/* Add form */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card mb-8">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Add influencer</h3>
          <form onSubmit={handleInfAdd} className="space-y-4">
            <div>
              <label htmlFor="inf-category" className="block text-sm font-medium text-charcoal/70 mb-1.5">Category</label>
              <select id="inf-category" name="inf-category" required className={inputClass}>
                {influencerCategories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="inf-name" className="block text-sm font-medium text-charcoal/70 mb-1.5">Name</label>
              <input type="text" id="inf-name" name="inf-name" required className={inputClass} placeholder="e.g. Charlie Munger" />
            </div>
            <div>
              <label htmlFor="inf-description" className="block text-sm font-medium text-charcoal/70 mb-1.5">Description</label>
              <input type="text" id="inf-description" name="inf-description" className={inputClass} placeholder="e.g. Investor, thinker" />
            </div>
            <div>
              <label htmlFor="inf-link" className="block text-sm font-medium text-charcoal/70 mb-1.5">Link</label>
              <input type="url" id="inf-link" name="inf-link" required className={inputClass} placeholder="https://..." />
            </div>
            <button type="submit" disabled={infAddStatus === 'saving'} className={btnPrimary}>
              {infAddStatus === 'saving' ? 'Saving...' : 'Add'}
            </button>
            {infAddStatus === 'saved' && <StatusBadge text="Saved!" />}
            {infAddStatus === 'error' && <StatusBadge text="Error" />}
          </form>
        </div>

        {/* List */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Current influencers</h3>
          {influencers ? (
            <div className="space-y-6">
              {influencerCategories.map(({ key: cat, label }) => (
                <div key={cat}>
                  <h4 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wide mb-3">{label}</h4>
                  {influencers[cat].length === 0 ? (
                    <p className="text-sm text-charcoal/30 italic">None yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {influencers[cat].map((item, index) => {
                        const isEditing = infEditing?.category === cat && infEditing?.index === index
                        if (isEditing) {
                          return (
                            <li key={`${cat}-${index}`} className="rounded-lg border-2 border-terracotta/30 bg-white px-4 py-3 space-y-3">
                              <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Name</label><input type="text" value={infEditing.name} onChange={(e) => setInfEditing({ ...infEditing, name: e.target.value })} className={inputClass + ' text-sm'} /></div>
                              <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Description</label><input type="text" value={infEditing.description} onChange={(e) => setInfEditing({ ...infEditing, description: e.target.value })} className={inputClass + ' text-sm'} /></div>
                              <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Link</label><input type="url" value={infEditing.link} onChange={(e) => setInfEditing({ ...infEditing, link: e.target.value })} className={inputClass + ' text-sm'} /></div>
                              <div className="flex gap-2 pt-1">
                                <button onClick={saveInfEdit} disabled={infEditStatus === 'saving'} className={btnSmall}>{infEditStatus === 'saving' ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => { setInfEditing(null); setInfEditStatus('idle') }} className={btnCancel}>Cancel</button>
                                {infEditStatus === 'error' && <span className="text-xs text-red-600 self-center">Failed.</span>}
                              </div>
                            </li>
                          )
                        }
                        return (
                          <li key={`${cat}-${index}`} className="flex items-center rounded-lg border border-sand px-4 py-2">
                            <ReorderButtons index={index} total={influencers[cat].length} onMove={(from, to) => handleInfMove(cat, from, to)} />
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-charcoal">{item.name}</span>
                              {item.description && <span className="text-xs text-charcoal/40 ml-2">{item.description}</span>}
                            </div>
                            <button onClick={() => setInfEditing({ category: cat, index, ...item })} className={`${actionLink} text-charcoal/30 hover:text-terracotta`}>Edit</button>
                            <button onClick={() => handleInfDelete(item.name, cat)} className={`${actionLink} text-charcoal/30 hover:text-red-600`}>Remove</button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-charcoal/30">Loading...</p>}
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* PROJECTS */}
      {/* ════════════════════════════════════════ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold text-charcoal mb-6 border-b border-sand pb-3">Projects</h2>

        {/* Add form */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card mb-8">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Add project</h3>
          <form onSubmit={handleProjAdd} className="space-y-4">
            <div>
              <label htmlFor="proj-name" className="block text-sm font-medium text-charcoal/70 mb-1.5">Name</label>
              <input type="text" id="proj-name" name="proj-name" required className={inputClass} placeholder="e.g. Pickup" />
            </div>
            <div>
              <label htmlFor="proj-description" className="block text-sm font-medium text-charcoal/70 mb-1.5">Description</label>
              <textarea id="proj-description" name="proj-description" required rows={3} className={inputClass + ' resize-none'} placeholder="What does this project do?" />
            </div>
            <div>
              <label htmlFor="proj-status" className="block text-sm font-medium text-charcoal/70 mb-1.5">Status</label>
              <select id="proj-status" name="proj-status" required className={inputClass}>
                {projectStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="proj-cta" className="block text-sm font-medium text-charcoal/70 mb-1.5">Call to action</label>
              <input type="text" id="proj-cta" name="proj-cta" required className={inputClass} placeholder="e.g. Join the Waitlist" />
            </div>
            <div>
              <label htmlFor="proj-ctaLink" className="block text-sm font-medium text-charcoal/70 mb-1.5">CTA link</label>
              <input type="url" id="proj-ctaLink" name="proj-ctaLink" className={inputClass} placeholder="https://... (optional)" />
            </div>
            <button type="submit" disabled={projAddStatus === 'saving'} className={btnPrimary}>
              {projAddStatus === 'saving' ? 'Saving...' : 'Add'}
            </button>
            {projAddStatus === 'saved' && <StatusBadge text="Saved!" />}
            {projAddStatus === 'error' && <StatusBadge text="Error" />}
          </form>
        </div>

        {/* List */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Current projects</h3>
          {projects ? (
            projects.length === 0 ? <p className="text-sm text-charcoal/30 italic">None yet.</p> : (
              <ul className="space-y-2">
                {projects.map((item, index) => {
                  const isEditing = projEditing?.index === index
                  if (isEditing) {
                    return (
                      <li key={index} className="rounded-lg border-2 border-terracotta/30 bg-white px-4 py-3 space-y-3">
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Name</label><input type="text" value={projEditing.name} onChange={(e) => setProjEditing({ ...projEditing, name: e.target.value })} className={inputClass + ' text-sm'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Description</label><textarea value={projEditing.description} onChange={(e) => setProjEditing({ ...projEditing, description: e.target.value })} rows={3} className={inputClass + ' text-sm resize-none'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Status</label>
                          <select value={projEditing.status} onChange={(e) => setProjEditing({ ...projEditing, status: e.target.value })} className={inputClass + ' text-sm'}>
                            {projectStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Call to action</label><input type="text" value={projEditing.cta} onChange={(e) => setProjEditing({ ...projEditing, cta: e.target.value })} className={inputClass + ' text-sm'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">CTA link</label><input type="url" value={projEditing.ctaLink} onChange={(e) => setProjEditing({ ...projEditing, ctaLink: e.target.value })} className={inputClass + ' text-sm'} placeholder="https://... (optional)" /></div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={saveProjEdit} disabled={projEditStatus === 'saving'} className={btnSmall}>{projEditStatus === 'saving' ? 'Saving...' : 'Save'}</button>
                          <button onClick={() => { setProjEditing(null); setProjEditStatus('idle') }} className={btnCancel}>Cancel</button>
                          {projEditStatus === 'error' && <span className="text-xs text-red-600 self-center">Failed.</span>}
                        </div>
                      </li>
                    )
                  }
                  return (
                    <li key={index} className="flex items-center rounded-lg border border-sand px-4 py-2">
                      <ReorderButtons index={index} total={projects.length} onMove={handleProjMove} />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-charcoal">{item.name}</span>
                        <span className="text-xs text-charcoal/30 ml-2">{item.status}</span>
                      </div>
                      <button onClick={() => setProjEditing({ index, name: item.name, description: item.description, status: item.status, cta: item.cta, ctaLink: item.ctaLink || '' })} className={`${actionLink} text-charcoal/30 hover:text-terracotta`}>Edit</button>
                      <button onClick={() => handleProjDelete(index)} className={`${actionLink} text-charcoal/30 hover:text-red-600`}>Remove</button>
                    </li>
                  )
                })}
              </ul>
            )
          ) : <p className="text-sm text-charcoal/30">Loading...</p>}
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* CONVERSATIONS */}
      {/* ════════════════════════════════════════ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold text-charcoal mb-6 border-b border-sand pb-3">Conversations</h2>

        {/* Add form */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card mb-8">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Add conversation</h3>
          <form onSubmit={handleConvAdd} className="space-y-4">
            <div>
              <label htmlFor="conv-title" className="block text-sm font-medium text-charcoal/70 mb-1.5">Title</label>
              <input type="text" id="conv-title" name="conv-title" required className={inputClass} placeholder="e.g. The Case for Building in Public" />
            </div>
            <div>
              <label htmlFor="conv-date" className="block text-sm font-medium text-charcoal/70 mb-1.5">Date</label>
              <input type="date" id="conv-date" name="conv-date" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="conv-excerpt" className="block text-sm font-medium text-charcoal/70 mb-1.5">Excerpt</label>
              <textarea id="conv-excerpt" name="conv-excerpt" required rows={2} className={inputClass + ' resize-none'} placeholder="A short summary shown on the listing page" />
            </div>
            <div>
              <label htmlFor="conv-content" className="block text-sm font-medium text-charcoal/70 mb-1.5">Content (Markdown)</label>
              <textarea id="conv-content" name="conv-content" rows={8} className={inputClass + ' resize-y font-mono text-sm'} placeholder="Write the full post in Markdown..." />
            </div>
            <button type="submit" disabled={convAddStatus === 'saving'} className={btnPrimary}>
              {convAddStatus === 'saving' ? 'Saving...' : 'Add'}
            </button>
            {convAddStatus === 'saved' && <StatusBadge text="Saved!" />}
            {convAddStatus === 'error' && <StatusBadge text="Error" />}
          </form>
        </div>

        {/* List */}
        <div className="bg-white/60 rounded-xl p-8 shadow-card">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Current conversations</h3>
          {conversations ? (
            conversations.length === 0 ? <p className="text-sm text-charcoal/30 italic">None yet.</p> : (
              <ul className="space-y-2">
                {conversations.map((item) => {
                  const isEditing = convEditing?.slug === item.slug
                  if (isEditing) {
                    return (
                      <li key={item.slug} className="rounded-lg border-2 border-terracotta/30 bg-white px-4 py-3 space-y-3">
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Title</label><input type="text" value={convEditing.title} onChange={(e) => setConvEditing({ ...convEditing, title: e.target.value })} className={inputClass + ' text-sm'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Date</label><input type="date" value={convEditing.date} onChange={(e) => setConvEditing({ ...convEditing, date: e.target.value })} className={inputClass + ' text-sm'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Excerpt</label><textarea value={convEditing.excerpt} onChange={(e) => setConvEditing({ ...convEditing, excerpt: e.target.value })} rows={2} className={inputClass + ' text-sm resize-none'} /></div>
                        <div><label className="block text-xs font-medium text-charcoal/50 mb-1">Content (Markdown)</label><textarea value={convEditing.content} onChange={(e) => setConvEditing({ ...convEditing, content: e.target.value })} rows={8} className={inputClass + ' text-sm resize-y font-mono'} /></div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={saveConvEdit} disabled={convEditStatus === 'saving'} className={btnSmall}>{convEditStatus === 'saving' ? 'Saving...' : 'Save'}</button>
                          <button onClick={() => { setConvEditing(null); setConvEditStatus('idle') }} className={btnCancel}>Cancel</button>
                          {convEditStatus === 'error' && <span className="text-xs text-red-600 self-center">Failed.</span>}
                        </div>
                      </li>
                    )
                  }
                  return (
                    <li key={item.slug} className="flex items-center rounded-lg border border-sand px-4 py-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-charcoal">{item.title}</span>
                        <span className="text-xs text-charcoal/30 ml-2">{item.date}</span>
                      </div>
                      <button onClick={() => setConvEditing({ ...item })} className={`${actionLink} text-charcoal/30 hover:text-terracotta`}>Edit</button>
                      <button onClick={() => handleConvDelete(item.slug)} className={`${actionLink} text-charcoal/30 hover:text-red-600`}>Remove</button>
                    </li>
                  )
                })}
              </ul>
            )
          ) : <p className="text-sm text-charcoal/30">Loading...</p>}
        </div>
      </div>
    </section>
  )
}
