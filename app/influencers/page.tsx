import { Metadata } from 'next'
import FadeIn from '@/components/FadeIn'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Influencers',
  description: 'People, companies, and content that influence Junto United.',
}

// ────────────────────────────────────────────
// Edit these lists to add/remove items.
// Each item needs: name, href, and icon (emoji or small text).
// ────────────────────────────────────────────

const individuals = [
  // { name: 'Charlie Munger', href: 'https://en.wikipedia.org/wiki/Charlie_Munger', icon: '🧠' },
  // { name: 'Ada Lovelace', href: 'https://en.wikipedia.org/wiki/Ada_Lovelace', icon: '💡' },
]

const companies = [
  // { name: 'Berkshire Hathaway', href: 'https://www.berkshirehathaway.com', icon: '🏛' },
  // { name: 'Stripe', href: 'https://stripe.com', icon: '💳' },
]

const content = [
  // { name: 'Poor Charlie\'s Almanack', href: 'https://example.com', icon: '📖' },
  // { name: 'How to Do Great Work', href: 'https://example.com', icon: '📝' },
]

type InfluencerItem = {
  name: string
  href: string
  icon: string
}

function InfluencerGrid({ items }: { items: InfluencerItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-charcoal/30 italic">Coming soon.</p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-sand bg-white/60 px-4 py-3 hover:border-terracotta/30 hover:shadow-card transition-all group"
        >
          <span className="text-xl flex-shrink-0">{item.icon}</span>
          <span className="text-sm font-medium text-charcoal/70 group-hover:text-charcoal transition-colors truncate">
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default function InfluencersPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-4">
          Influencers
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4 leading-tight">
          Who influences us
        </h1>
        <p className="text-charcoal/50 text-lg max-w-lg mb-16 leading-relaxed">
          People, companies, and content that shape how we think and what we build.
        </p>
      </FadeIn>

      <div className="space-y-16">
        <FadeIn delay={0.1}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Individuals
          </h2>
          <InfluencerGrid items={individuals} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Companies
          </h2>
          <InfluencerGrid items={companies} />
        </FadeIn>

        <FadeIn delay={0.3}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Content
          </h2>
          <InfluencerGrid items={content} />
        </FadeIn>
      </div>
    </section>
  )
}
